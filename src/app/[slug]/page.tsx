import { notFound } from 'next/navigation';
import { getPortfolioBySlug } from '@/lib/supabase';
import MinimalTemplate from '@/components/templates/minimal';
import ModernTemplate from '@/components/templates/modern';
import CreativeTemplate from '@/components/templates/creative';
import BoldTemplate from '@/components/templates/bold';
import ElegantTemplate from '@/components/templates/elegant';
import type { PortfolioData } from '@/lib/types'; // This import is unused in the component but usually good for type docs, can remove to be cleaner

interface PageProps {
    params: Promise<{ slug: string }>;
}

const templates = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    bold: BoldTemplate,
    elegant: ElegantTemplate,
};

export default async function PortfolioSlugPage({ params }: PageProps) {
    const { slug } = await params;

    // Try to fetch from Supabase by slug
    // Note: getPortfolioBySlug expects the slug string
    const portfolio = await getPortfolioBySlug(slug);

    if (!portfolio) {
        notFound();
    }

    const Template = templates[portfolio.templateStyle] || ModernTemplate;

    return <Template portfolio={portfolio} />;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const portfolio = await getPortfolioBySlug(slug);

    if (!portfolio) {
        return {
            title: 'Portfolio Not Found | DesignPortfol.io',
        };
    }

    const name = `${portfolio.personal.firstName} ${portfolio.personal.lastName}`;

    return {
        title: `${name} | Portfolio`,
        description: portfolio.personal.headline || `${name}'s professional portfolio`,
        openGraph: {
            title: `${name} | Portfolio`,
            description: portfolio.personal.headline,
            type: 'profile',
        },
    };
}
