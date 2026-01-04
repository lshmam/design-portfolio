'use server';

import { createPortfolio } from '@/lib/supabase';
import { getUser } from '@/app/auth/actions';
import { PortfolioData } from '@/lib/types';

export async function savePortfolio(data: Partial<PortfolioData>) {
    const user = await getUser();
    if (!user) {
        throw new Error('User not authenticated');
    }

    // Ensure email is set from user session if not in data
    if (!data.personal) {
        data.personal = {} as any;
    }

    // We already trust getUser() returns the authenticated user
    // We use the user's email to identify/upsert the portfolio
    if (!data.personal?.email && user.email) {
        data.personal!.email = user.email;
    }

    // Upsert the portfolio
    const saved = await createPortfolio(data, user.id);
    return saved;
}
