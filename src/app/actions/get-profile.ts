'use server';

import { v4 as uuidv4 } from 'uuid';
import type { PortfolioData, Experience, Education } from '@/lib/types';

// Interface for the clean mapped data
interface UserData {
    fullName: string;
    firstName: string;
    lastName: string;
    title: string;
    about: string;
    location: string;
    profileImage: string;
    email: string;
    experiences: Array<{
        id: string;
        company: string;
        role: string;
        startDate: string;
        endDate: string;
        current: boolean;
        location: string;
        description: string;
    }>;
    education: Array<{
        id: string;
        school: string;
        degree: string;
        field: string;
        startDate: string;
        endDate: string;
    }>;
    skills: string[];
}

// API response interface based on the provided sample
interface LinkedInAPIResponse {
    data: {
        first_name: string;
        last_name: string;
        full_name: string;
        headline: string;
        about?: string;
        summary?: string;
        location: string;
        city?: string;
        country?: string;
        profile_image_url: string;
        email?: string;
        experiences?: Array<{
            company: string;
            title: string;
            date_range: string;
            start_month?: number;
            start_year?: number;
            end_month?: number | string;
            end_year?: number | string;
            is_current?: boolean;
            location?: string;
            description?: string;
            skills?: string;
        }>;
        educations?: Array<{
            school: string;
            degree?: string;
            field_of_study?: string;
            date_range?: string;
            start_year?: number;
            end_year?: number;
        }>;
    };
    message: string;
}

export async function importLinkedInProfile(linkedinUrl: string): Promise<Partial<PortfolioData>> {
    const apiKey = process.env.RAPID_API_KEY;
    const apiHost = process.env.RAPID_API_HOST || 'fresh-linkedin-profile-data.p.rapidapi.com';

    if (!apiKey) {
        throw new Error('RAPID_API_KEY is not configured. Please add it to your environment variables.');
    }

    try {
        // Clean up the LinkedIn URL - ensure it's a full URL
        let cleanUrl = linkedinUrl.trim();
        if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl;
        }
        // Remove trailing slashes
        cleanUrl = cleanUrl.replace(/\/+$/, '');

        const apiUrl = `https://${apiHost}/enrich-lead?linkedin_url=${encodeURIComponent(cleanUrl)}&include_skills=true&include_certifications=false&include_publications=false&include_honors=false&include_volunteers=false&include_projects=false&include_patents=false&include_courses=false&include_organizations=false&include_profile_status=false&include_company_public_url=false`;

        console.log('Fetching LinkedIn profile from:', apiUrl);
        console.log('Using API host:', apiHost);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost,
            },
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const result: LinkedInAPIResponse = await response.json();

        if (!result.data || result.message !== 'ok') {
            throw new Error('Profile is private or API limit reached.');
        }

        const data = result.data;

        // Map the API response to our clean UserData structure
        const userData: UserData = {
            fullName: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            title: data.headline || '',
            about: data.about || data.summary || '',
            location: data.location || (data.city && data.country ? `${data.city}, ${data.country}` : ''),
            profileImage: data.profile_image_url || '',
            email: data.email || '',
            experiences: (data.experiences || []).map(exp => ({
                id: uuidv4(),
                company: exp.company || '',
                role: exp.title || '',
                startDate: formatDate(exp.start_month, exp.start_year),
                endDate: exp.is_current ? 'Present' : formatDate(exp.end_month, exp.end_year),
                current: exp.is_current || false,
                location: exp.location || '',
                description: exp.description || '',
            })),
            education: (data.educations || []).map(edu => ({
                id: uuidv4(),
                school: edu.school || '',
                degree: edu.degree || '',
                field: edu.field_of_study || '',
                startDate: edu.start_year?.toString() || '',
                endDate: edu.end_year?.toString() || '',
            })),
            skills: extractSkills(data.experiences || []),
        };

        // Map to PortfolioData structure
        const portfolioData: Partial<PortfolioData> = {
            personal: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                headline: userData.title,
                summary: userData.about,
                location: userData.location,
                email: userData.email,
                photoUrl: userData.profileImage,
            },
            experiences: userData.experiences.map(exp => ({
                id: exp.id,
                company: exp.company,
                title: exp.role,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate,
                current: exp.current,
                description: exp.description,
            })),
            education: userData.education.map(edu => ({
                id: edu.id,
                school: edu.school,
                degree: edu.degree,
                field: edu.field,
                startDate: edu.startDate,
                endDate: edu.endDate,
            })),
            skills: userData.skills,
            projects: [],
        };

        return portfolioData;
    } catch (error) {
        console.error('LinkedIn API Error:', error);
        throw new Error(
            error instanceof Error
                ? error.message
                : 'Failed to fetch LinkedIn profile. Please try again.'
        );
    }
}

// Helper function to format date from month/year
function formatDate(month?: number | string, year?: number | string): string {
    if (!year) return '';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (month && typeof month === 'number' && month >= 1 && month <= 12) {
        return `${months[month - 1]} ${year}`;
    }

    if (month && typeof month === 'string') {
        return `${month} ${year}`;
    }

    return year.toString();
}

// Extract skills from experience entries
function extractSkills(experiences: Array<{ skills?: string }>): string[] {
    const allSkills: string[] = [];

    for (const exp of experiences) {
        if (exp.skills) {
            const skills = exp.skills.split('·').map(s => s.trim()).filter(Boolean);
            allSkills.push(...skills);
        }
    }

    // Remove duplicates
    return [...new Set(allSkills)];
}
