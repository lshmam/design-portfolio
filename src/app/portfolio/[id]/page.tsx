import { notFound } from 'next/navigation';
import { getPortfolioBySlug } from '@/lib/supabase';
import MinimalTemplate from '@/components/templates/minimal';
import ModernTemplate from '@/components/templates/modern';
import CreativeTemplate from '@/components/templates/creative';
import BoldTemplate from '@/components/templates/bold';
import ElegantTemplate from '@/components/templates/elegant';
import type { PortfolioData } from '@/lib/types';

interface PortfolioPageProps {
    params: Promise<{ id: string }>;
}

const templates = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    bold: BoldTemplate,
    elegant: ElegantTemplate,
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
    const { id } = await params;

    // Try to fetch from Supabase by slug
    const portfolio = await getPortfolioBySlug(id);

    if (!portfolio) {
        notFound();
    }

    const Template = templates[portfolio.templateStyle] || ModernTemplate;

    return <Template portfolio={portfolio} />;
}

export async function generateMetadata({ params }: PortfolioPageProps) {
    const { id } = await params;
    const portfolio = await getPortfolioBySlug(id);

    if (!portfolio) {
        return {
            title: 'Portfolio | DesignPortfol.io',
            description: 'Professional portfolio created with DesignPortfol.io',
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
