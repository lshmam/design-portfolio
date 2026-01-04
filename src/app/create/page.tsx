import { redirect } from 'next/navigation';
import { getUser } from '@/app/auth/actions';
import { getPortfolioByUserId, getPortfolioByEmail } from '@/lib/supabase';
import CreatePageClient from './create-client';

export default async function CreatePage() {
    const user = await getUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/login?next=/create');
    }

    // Check if user already has a portfolio
    let existingPortfolio = null;
    try {
        if (user.email) {
            existingPortfolio = await getPortfolioByEmail(user.email);
        }
    } catch (error) {
        // Supabase might not be configured yet, continue without existing data
        console.log('Could not fetch existing portfolio:', error);
    }

    return (
        <CreatePageClient
            userEmail={user.email || ''}
            userId={user.id}
            existingPortfolio={existingPortfolio}
        />
    );
}
