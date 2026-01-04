import { redirect } from 'next/navigation';
import { getUser } from '@/app/auth/actions';
import CreatePageClient from './create-client';

export default async function CreatePage() {
    const user = await getUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/login?next=/create');
    }

    return <CreatePageClient userEmail={user.email || ''} />;
}
