import { v4 as uuidv4 } from 'uuid';
import type { LinkedInExportData, PortfolioData, Experience, Education } from './types';

// Parse LinkedIn PDF - specifically designed for LinkedIn's "Save to PDF" format
// Format: Two-column layout with dark sidebar (Contact, Top Skills, Languages, Certifications)
// and main content area (Name, Headline, Location, Summary, Experience, Education)
function parseLinkedInPDFText(text: string): LinkedInExportData {
    const data: LinkedInExportData = {
        profile: {
            firstName: '',
            lastName: '',
            headline: '',
            summary: '',
            location: '',
            email: ''
        },
        positions: [],
        education: [],
        skills: []
    };

    console.log('=== RAW PDF TEXT ===');
    console.log(text);
    console.log('=== END RAW TEXT ===');

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // === EXTRACT EMAIL ===
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
        data.profile!.email = emailMatch[1];
    }

    // === EXTRACT TOP SKILLS ===
    // Look for "Top Skills" followed by skill items until next section
    const topSkillsIndex = lines.findIndex(l => l === 'Top Skills');
    if (topSkillsIndex !== -1) {
        for (let i = topSkillsIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            // Stop at next section header
            if (['Languages', 'Certifications', 'Summary', 'Experience', 'Education', 'Contact'].includes(line)) {
                break;
            }
            // Skip very long lines or lines with special patterns
            if (line.length > 0 && line.length < 50 && !line.includes('@') && !line.includes('Page')) {
                data.skills!.push(line);
            }
        }
    }

    // === FIND NAME AND HEADLINE ===
    // The name is usually one of the first prominent lines after sidebar content
    // Look for a line that looks like a proper name (2-4 capitalized words)
    for (let i = 0; i < Math.min(lines.length, 30); i++) {
        const line = lines[i];

        // Skip sidebar sections
        if (['Contact', 'Top Skills', 'Languages', 'Certifications'].includes(line)) continue;
        if (line.includes('@')) continue; // email
        if (line.includes('www.') || line.includes('linkedin.com')) continue; // URLs
        if (line.includes('(LinkedIn)') || line.includes('(Company)')) continue;

        // Check if this looks like a full name (2-4 capitalized words)
        const words = line.split(/\s+/);
        const looksLikeName = words.length >= 2 &&
            words.length <= 4 &&
            words.every(w => /^[A-Z][a-zA-Z]*$/.test(w));

        if (looksLikeName && !data.profile!.firstName) {
            data.profile!.firstName = words[0];
            data.profile!.lastName = words.slice(1).join(' ');

            // Next non-sidebar line is likely the headline
            for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
                const nextLine = lines[j];
                if (!['Contact', 'Top Skills', 'Languages', 'Certifications', 'Summary', 'Experience'].includes(nextLine) &&
                    !nextLine.includes('@') && nextLine.length > 5) {
                    // Check if it contains typical headline patterns
                    if (nextLine.includes('|') || nextLine.includes('at') ||
                        nextLine.includes('Engineer') || nextLine.includes('Manager') ||
                        nextLine.includes('Developer') || nextLine.includes('Designer') ||
                        nextLine.match(/[A-Z][a-z]+\s+(AI|Inc|Corp|LLC|Ltd)/)) {
                        data.profile!.headline = nextLine;

                        // Next line after that might be location
                        if (j + 1 < lines.length) {
                            const locLine = lines[j + 1];
                            if (locLine.includes('Area') || locLine.includes('Metropolitan') ||
                                locLine.match(/[A-Z][a-z]+,\s*[A-Z]{2}/) ||
                                locLine.includes('Vancouver') || locLine.includes('Toronto') ||
                                locLine.includes('New York') || locLine.includes('San Francisco')) {
                                data.profile!.location = locLine;
                            }
                        }
                        break;
                    }
                }
            }
            break;
        }
    }

    // === EXTRACT SUMMARY ===
    const summaryIndex = lines.findIndex(l => l === 'Summary');
    if (summaryIndex !== -1) {
        const summaryLines: string[] = [];
        for (let i = summaryIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (['Experience', 'Education', 'Skills', 'Certifications', 'Languages'].includes(line)) {
                break;
            }
            if (line.length > 0 && !line.match(/^Page \d+ of \d+$/)) {
                summaryLines.push(line);
            }
        }
        data.profile!.summary = summaryLines.join(' ');
    }

    // === EXTRACT EXPERIENCE ===
    const experienceIndex = lines.findIndex(l => l === 'Experience');
    if (experienceIndex !== -1) {
        let educationIndex = lines.findIndex(l => l === 'Education');
        if (educationIndex === -1) educationIndex = lines.length;

        const experienceLines = lines.slice(experienceIndex + 1, educationIndex);
        parseExperienceLines(experienceLines, data);
    }

    // === EXTRACT EDUCATION ===
    const educationIndex = lines.findIndex(l => l === 'Education');
    if (educationIndex !== -1) {
        const educationLines = lines.slice(educationIndex + 1);
        parseEducationLines(educationLines, data);
    }

    console.log('=== PARSED DATA ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('=== END PARSED DATA ===');

    return data;
}

// Parse experience section
function parseExperienceLines(lines: string[], data: LinkedInExportData) {
    // LinkedIn experience format:
    // Company Name
    // Job Title
    // Month Year - Month Year (Duration) OR Month Year - Present (Duration)
    // Location (City, Province/State)
    // • Bullet point description
    // • Another bullet point

    const datePattern = /^([A-Z][a-z]+ \d{4})\s*[-–]\s*(Present|[A-Z][a-z]+ \d{4})(?:\s*\(.*\))?$/;
    const locationPattern = /^[A-Z][a-zA-Z\s]+,\s*[A-Z]{2}$/;
    const bulletPattern = /^[•·\-\*]\s*/;

    // Pattern to detect language entries from sidebar (e.g., "Bengali (Native or Bilingual)")
    const languagePattern = /\((Native|Bilingual|Elementary|Limited Working|Professional Working|Full Professional|Native or Bilingual)\)/i;

    // Common sidebar section headers to skip
    const sidebarSections = ['Contact', 'Top Skills', 'Languages', 'Certifications', 'Licenses'];

    let currentExp: {
        company: string;
        title: string;
        dates: string;
        location: string;
        description: string[];
    } | null = null;

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        // Skip page numbers and empty content
        if (line.match(/^Page \d+ of \d+$/) || line.length === 0) {
            i++;
            continue;
        }

        // Skip language proficiency entries (from sidebar mixing)
        if (languagePattern.test(line)) {
            i++;
            continue;
        }

        // Skip sidebar section headers
        if (sidebarSections.includes(line)) {
            i++;
            continue;
        }

        // Skip page end markers
        if (line.includes('--- Page') && line.includes('End ---')) {
            i++;
            continue;
        }

        // Skip certification entries (from sidebar mixing)
        if (line.toLowerCase().includes('certification') ||
            line.toLowerCase().includes('certificate') ||
            line.toLowerCase().includes('licensed') ||
            line.toLowerCase().includes('license')) {
            i++;
            continue;
        }

        // Check if this is a bullet point (description)
        if (bulletPattern.test(line) || line.startsWith('•')) {
            if (currentExp) {
                currentExp.description.push(line.replace(bulletPattern, '').replace(/^•\s*/, '').trim());
            }
            i++;
            continue;
        }

        // Check if this is a date line
        if (datePattern.test(line)) {
            if (currentExp) {
                currentExp.dates = line;
            }
            i++;
            continue;
        }

        // Check if this is a location line
        if (locationPattern.test(line)) {
            if (currentExp) {
                currentExp.location = line;
            }
            i++;
            continue;
        }

        // Check if this looks like a company name + title pattern
        // Company name is followed by job title, then date
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        const lineAfterNext = i + 2 < lines.length ? lines[i + 2] : '';

        // If two lines from now is a date, this line is company, next is title
        if (datePattern.test(lineAfterNext)) {
            // Save previous experience if exists
            if (currentExp && currentExp.company) {
                data.positions!.push({
                    companyName: currentExp.company,
                    title: currentExp.title,
                    startDate: extractStartDate(currentExp.dates),
                    endDate: extractEndDate(currentExp.dates),
                    location: currentExp.location,
                    description: currentExp.description.join('\n')
                });
            }

            // Start new experience
            currentExp = {
                company: line,
                title: nextLine,
                dates: '',
                location: '',
                description: []
            };
            i += 2; // Skip both company and title
            continue;
        }

        // If next line is a date, this line might be the title (company was already set)
        if (datePattern.test(nextLine) && currentExp) {
            // This might be a new role at same company, or we missed the company
            // For now, treat it as a new position
            if (currentExp.company) {
                data.positions!.push({
                    companyName: currentExp.company,
                    title: currentExp.title,
                    startDate: extractStartDate(currentExp.dates),
                    endDate: extractEndDate(currentExp.dates),
                    location: currentExp.location,
                    description: currentExp.description.join('\n')
                });
            }

            currentExp = {
                company: line,
                title: '',
                dates: '',
                location: '',
                description: []
            };
            i++;
            continue;
        }

        // If we don't have a current experience yet, start one with this as company
        if (!currentExp) {
            currentExp = {
                company: line,
                title: '',
                dates: '',
                location: '',
                description: []
            };
        } else if (!currentExp.title && line.length > 0) {
            // If we have company but no title, this might be the title
            currentExp.title = line;
        }

        i++;
    }

    // Save last experience
    if (currentExp && currentExp.company) {
        data.positions!.push({
            companyName: currentExp.company,
            title: currentExp.title,
            startDate: extractStartDate(currentExp.dates),
            endDate: extractEndDate(currentExp.dates),
            location: currentExp.location,
            description: currentExp.description.join('\n')
        });
    }
}

// Parse education section
function parseEducationLines(lines: string[], data: LinkedInExportData) {
    // LinkedIn education format:
    // School Name
    // Degree - Field of Study
    // (Start Date - End Date)

    const datePattern = /\(?([A-Z][a-z]+\s+\d{4})\s*[-–]\s*([A-Z][a-z]+\s+\d{4})\)?/;

    let currentEdu: {
        school: string;
        degree: string;
        field: string;
        dates: string;
    } | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip page numbers
        if (line.match(/^Page \d+ of \d+$/)) continue;

        // Skip page end markers
        if (line.includes('--- Page') && line.includes('End ---')) continue;

        // Skip certification entries
        if (line.toLowerCase().includes('certification') ||
            line.toLowerCase().includes('certificate')) continue;

        // Skip sidebar section headers
        if (['Contact', 'Top Skills', 'Languages', 'Certifications', 'Licenses'].includes(line)) continue;

        // Check for date pattern
        const dateMatch = line.match(datePattern);
        if (dateMatch) {
            if (currentEdu) {
                currentEdu.dates = `${dateMatch[1]} - ${dateMatch[2]}`;

                // Save this education entry
                data.education!.push({
                    schoolName: currentEdu.school,
                    degreeName: currentEdu.degree,
                    fieldOfStudy: currentEdu.field,
                    startDate: dateMatch[1],
                    endDate: dateMatch[2]
                });
                currentEdu = null;
            }
            continue;
        }

        // Check for degree line (contains degree keywords)
        if (line.match(/Bachelor|Master|PhD|Doctor|Associate|Diploma|Certificate|BASc|BSc|BA|MBA|MS|MA|B\.S\.|M\.S\./i)) {
            if (!currentEdu) {
                currentEdu = { school: '', degree: '', field: '', dates: '' };
            }

            // Parse degree and field from line like "Bachelor of Applied Science - BASc, Biomedical/Medical Engineering"
            const parts = line.split(/\s*[-–,]\s*/);
            currentEdu.degree = parts[0];
            if (parts.length > 1) {
                currentEdu.field = parts.slice(1).join(', ');
            }
            continue;
        }

        // Otherwise, this might be a school name
        if (line.length > 0 && !line.match(/^Page/)) {
            if (!currentEdu) {
                currentEdu = { school: line, degree: '', field: '', dates: '' };
            } else if (!currentEdu.school) {
                currentEdu.school = line;
            }
        }
    }

    // Save last education if we have one pending
    if (currentEdu && currentEdu.school) {
        data.education!.push({
            schoolName: currentEdu.school,
            degreeName: currentEdu.degree,
            fieldOfStudy: currentEdu.field,
            startDate: extractStartDate(currentEdu.dates),
            endDate: extractEndDate(currentEdu.dates)
        });
    }
}

// Helper functions
function extractStartDate(dates: string): string {
    if (!dates) return '';
    const match = dates.match(/([A-Z][a-z]+\s+\d{4})/);
    return match ? match[1] : '';
}

function extractEndDate(dates: string): string {
    if (!dates) return '';
    const match = dates.match(/[-–]\s*(Present|[A-Z][a-z]+\s+\d{4})/);
    return match ? match[1] : '';
}

// Parse LinkedIn PDF file (client-side using pdfjs)
export async function parseLinkedInPDF(file: File): Promise<LinkedInExportData> {
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker path to local file
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Get all text items with positions
        const items = textContent.items as Array<{ str: string; transform: number[]; width: number }>;

        // Group items by approximate Y position (same line)
        const lineMap = new Map<number, Array<{ x: number; text: string }>>();

        for (const item of items) {
            if (!('str' in item) || !item.str.trim()) continue;

            const y = Math.round(item.transform[5]); // Y position
            const x = item.transform[4]; // X position

            // Round Y to group items on same line (within 3 pixels)
            const roundedY = Math.round(y / 3) * 3;

            if (!lineMap.has(roundedY)) {
                lineMap.set(roundedY, []);
            }
            lineMap.get(roundedY)!.push({ x, text: item.str });
        }

        // Sort by Y (descending = top to bottom), then construct lines
        const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

        for (const y of sortedYs) {
            const lineItems = lineMap.get(y)!;
            // Sort by X position (left to right)
            lineItems.sort((a, b) => a.x - b.x);

            // Join items on same line
            const lineText = lineItems.map(item => item.text).join(' ').trim();
            if (lineText) {
                fullText += lineText + '\n';
            }
        }

        fullText += `\n--- Page ${pageNum} End ---\n`;
    }

    return parseLinkedInPDFText(fullText);
}

// Convert LinkedIn export data to Portfolio data
export function linkedInToPortfolio(linkedIn: LinkedInExportData): Partial<PortfolioData> {
    const experiences: Experience[] = (linkedIn.positions || []).map(p => ({
        id: uuidv4(),
        company: p.companyName || '',
        title: p.title || '',
        location: p.location,
        startDate: p.startDate || '',
        endDate: p.endDate,
        current: !p.endDate || p.endDate.toLowerCase() === 'present',
        description: p.description || ''
    }));

    const education: Education[] = (linkedIn.education || []).map(e => ({
        id: uuidv4(),
        school: e.schoolName || '',
        degree: e.degreeName || '',
        field: e.fieldOfStudy || '',
        startDate: e.startDate || '',
        endDate: e.endDate,
        description: e.notes
    }));

    return {
        personal: {
            firstName: linkedIn.profile?.firstName || '',
            lastName: linkedIn.profile?.lastName || '',
            headline: linkedIn.profile?.headline || '',
            summary: linkedIn.profile?.summary || '',
            location: linkedIn.profile?.location || '',
            email: linkedIn.profile?.email || '',
            phone: '',
            website: '',
            linkedinUrl: '',
            photoUrl: ''
        },
        experiences,
        education,
        skills: linkedIn.skills || [],
        projects: []
    };
}
