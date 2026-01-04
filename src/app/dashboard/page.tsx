import { redirect } from 'next/navigation';
import { getUser } from '@/app/auth/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/auth/actions';
import { Plus, User, LogOut } from 'lucide-react';

export default async function DashboardPage() {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl">
                        DesignPortfol.io
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        <form action={signOut}>
                            <Button variant="ghost" size="sm" type="submit">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Your Portfolios</h1>
                        <p className="text-muted-foreground">
                            Manage and create your professional portfolios
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Create New
                        </Link>
                    </Button>
                </div>

                {/* Empty State */}
                <div className="border border-dashed border-border rounded-xl p-12 text-center">
                    <div className="max-w-sm mx-auto">
                        <h2 className="text-xl font-semibold mb-2">No portfolios yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Create your first portfolio by importing your LinkedIn profile or entering your information manually.
                        </p>
                        <Button asChild>
                            <Link href="/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Portfolio
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
