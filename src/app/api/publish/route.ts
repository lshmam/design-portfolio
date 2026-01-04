import { NextRequest, NextResponse } from 'next/server';
import { createPortfolio } from '@/lib/supabase';
import type { PortfolioData } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const portfolioData: Partial<PortfolioData> = body.portfolioData;
        const userId: string | undefined = body.userId;

        if (!portfolioData) {
            return NextResponse.json(
                { error: 'Portfolio data is required' },
                { status: 400 }
            );
        }

        const portfolio = await createPortfolio(portfolioData, userId);

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Failed to create portfolio' },
                { status: 500 }
            );
        }

        // Generate the published URL
        const slug = `${portfolio.personal.firstName}-${portfolio.personal.lastName}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        return NextResponse.json({
            success: true,
            portfolioId: portfolio.id,
            url: `https://designportfol.io/${slug}`,
            slug,
        });
    } catch (error) {
        console.error('Publish error:', error);
        return NextResponse.json(
            { error: 'Failed to publish portfolio' },
            { status: 500 }
        );
    }
}
