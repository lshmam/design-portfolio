import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
                    <p className="text-muted-foreground">
                        Something went wrong during sign in. This could be due to an expired link or a configuration issue.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button asChild>
                        <Link href="/login">Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
