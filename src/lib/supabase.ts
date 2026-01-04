import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { PortfolioData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create client only if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to check if Supabase is available
function getSupabase(): SupabaseClient {
    if (!supabase) {
        throw new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
    }
    return supabase;
}

// Portfolio database operations
export async function createPortfolio(data: Partial<PortfolioData>): Promise<PortfolioData | null> {
    const db = getSupabase();
    const slug = generateSlug(data);

    const { data: portfolio, error } = await db
        .from('portfolios')
        .insert({
            slug,
            first_name: data.personal?.firstName || '',
            last_name: data.personal?.lastName || '',
            headline: data.personal?.headline || '',
            summary: data.personal?.summary || '',
            location: data.personal?.location || '',
            email: data.personal?.email || '',
            phone: data.personal?.phone || null,
            website: data.personal?.website || null,
            linkedin_url: data.personal?.linkedinUrl || null,
            photo_url: data.personal?.photoUrl || null,
            experiences: data.experiences || [],
            education: data.education || [],
            skills: data.skills || [],
            projects: data.projects || [],
            template_style: data.templateStyle || 'modern',
            hosting_option: data.hostingOption || 'hosted',
            custom_domain: data.customDomain || null,
            color_accent: data.colorAccent || '#6366f1',
            is_paid: false,
            is_published: true,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating portfolio:', error);
        return null;
    }

    return mapDbToPortfolio(portfolio);
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioData | null> {
    const db = getSupabase();

    const { data: portfolio, error } = await db
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !portfolio) {
        return null;
    }

    return mapDbToPortfolio(portfolio);
}

export async function getPortfolioById(id: string): Promise<PortfolioData | null> {
    const db = getSupabase();

    const { data: portfolio, error } = await db
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !portfolio) {
        return null;
    }

    return mapDbToPortfolio(portfolio);
}

export async function updatePortfolio(id: string, data: Partial<PortfolioData>): Promise<PortfolioData | null> {
    const db = getSupabase();
    const updates: Record<string, unknown> = {};

    if (data.personal) {
        if (data.personal.firstName !== undefined) updates.first_name = data.personal.firstName;
        if (data.personal.lastName !== undefined) updates.last_name = data.personal.lastName;
        if (data.personal.headline !== undefined) updates.headline = data.personal.headline;
        if (data.personal.summary !== undefined) updates.summary = data.personal.summary;
        if (data.personal.location !== undefined) updates.location = data.personal.location;
        if (data.personal.email !== undefined) updates.email = data.personal.email;
        if (data.personal.phone !== undefined) updates.phone = data.personal.phone;
        if (data.personal.website !== undefined) updates.website = data.personal.website;
        if (data.personal.linkedinUrl !== undefined) updates.linkedin_url = data.personal.linkedinUrl;
        if (data.personal.photoUrl !== undefined) updates.photo_url = data.personal.photoUrl;
    }
    if (data.experiences !== undefined) updates.experiences = data.experiences;
    if (data.education !== undefined) updates.education = data.education;
    if (data.skills !== undefined) updates.skills = data.skills;
    if (data.projects !== undefined) updates.projects = data.projects;
    if (data.templateStyle !== undefined) updates.template_style = data.templateStyle;
    if (data.hostingOption !== undefined) updates.hosting_option = data.hostingOption;
    if (data.customDomain !== undefined) updates.custom_domain = data.customDomain;
    if (data.colorAccent !== undefined) updates.color_accent = data.colorAccent;
    if (data.isPaid !== undefined) updates.is_paid = data.isPaid;

    const { data: portfolio, error } = await db
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating portfolio:', error);
        return null;
    }

    return mapDbToPortfolio(portfolio);
}

export async function checkSlugAvailability(slug: string): Promise<boolean> {
    const db = getSupabase();

    const { data, error } = await db
        .from('portfolios')
        .select('id')
        .eq('slug', slug)
        .single();

    return !data && !error;
}

// Helper to generate a unique slug
function generateSlug(data: Partial<PortfolioData>): string {
    const firstName = data.personal?.firstName || '';
    const lastName = data.personal?.lastName || '';
    const baseName = `${firstName}-${lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // Add random suffix for uniqueness
    const suffix = Math.random().toString(36).substring(2, 6);
    return baseName ? `${baseName}-${suffix}` : suffix;
}

// Map database row to PortfolioData type
function mapDbToPortfolio(row: Record<string, unknown>): PortfolioData {
    return {
        id: row.id as string,
        personal: {
            firstName: row.first_name as string,
            lastName: row.last_name as string,
            headline: row.headline as string,
            summary: row.summary as string,
            location: row.location as string,
            email: row.email as string,
            phone: row.phone as string | undefined,
            website: row.website as string | undefined,
            linkedinUrl: row.linkedin_url as string | undefined,
            photoUrl: row.photo_url as string | undefined,
        },
        experiences: row.experiences as PortfolioData['experiences'],
        education: row.education as PortfolioData['education'],
        skills: row.skills as string[],
        projects: row.projects as PortfolioData['projects'],
        templateStyle: row.template_style as PortfolioData['templateStyle'],
        hostingOption: row.hosting_option as PortfolioData['hostingOption'],
        customDomain: row.custom_domain as string | undefined,
        colorAccent: row.color_accent as string | undefined,
        isPaid: row.is_paid as boolean,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}
