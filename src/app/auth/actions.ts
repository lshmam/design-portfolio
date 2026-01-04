'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function signInWithGoogle(redirectTo: string = '/dashboard') {
    const supabase = await createSupabaseServerClient();

    const headersList = await headers();
    const origin = headersList.get('origin') || headersList.get('x-forwarded-host') || 'http://localhost:3000';

    // Ensure origin has protocol
    const fullOrigin = origin.startsWith('http') ? origin : `https://${origin}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${fullOrigin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (error) {
        console.error('OAuth error:', error);
        return { error: error.message };
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signOut() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/');
}

export async function getSession() {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function getUser() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
