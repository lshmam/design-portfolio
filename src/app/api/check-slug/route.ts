import { NextRequest, NextResponse } from 'next/server';
import { checkSlugAvailability } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json(
            { error: 'Slug parameter is required' },
            { status: 400 }
        );
    }

    try {
        const isAvailable = await checkSlugAvailability(slug);
        return NextResponse.json({ slug, available: isAvailable });
    } catch (error) {
        console.error('Error checking slug:', error);
        return NextResponse.json(
            { error: 'Failed to check slug availability' },
            { status: 500 }
        );
    }
}
