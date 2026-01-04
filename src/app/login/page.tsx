'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import GoogleLoginButton from '@/components/google-login-button';

function LoginContent() {
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/dashboard';

    return (
        <div className="max-w-sm w-full space-y-8">
            {/* Logo */}
            <div className="text-center">
                <Link href="/" className="inline-flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-2xl">DesignPortfol.io</span>
                </Link>
                <h1 className="text-2xl font-bold mb-2">Create your portfolio</h1>
                <p className="text-muted-foreground">
                    Sign in with Google to get started
                </p>
            </div>

            {/* Login Options */}
            <div className="space-y-4">
                <GoogleLoginButton className="w-full" redirectTo={next} />
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-foreground">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Suspense fallback={
                <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                </div>
            }>
                <LoginContent />
            </Suspense>
        </div>
    );
}
