'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link2, CheckCircle, AlertCircle, Loader2, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { importLinkedInProfile } from '@/app/actions/get-profile';
import type { PortfolioData } from '@/lib/types';

interface LinkedInUploaderProps {
    onDataParsed: (data: Partial<PortfolioData>) => void;
}

export default function LinkedInUploader({ onDataParsed }: LinkedInUploaderProps) {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleImport = useCallback(async () => {
        // Validate URL
        if (!linkedinUrl.trim()) {
            setStatus('error');
            setErrorMessage('Please enter a LinkedIn profile URL');
            return;
        }

        if (!linkedinUrl.includes('linkedin.com/in/')) {
            setStatus('error');
            setErrorMessage('Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username)');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const portfolioData = await importLinkedInProfile(linkedinUrl);

            // Check if we got meaningful data
            if (!portfolioData.personal?.firstName && !portfolioData.experiences?.length) {
                setStatus('error');
                setErrorMessage('Could not fetch profile data. The profile may be private or the API limit may have been reached.');
                return;
            }

            setStatus('success');
            onDataParsed(portfolioData);
        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch profile. Please try again.');
            console.error(err);
        }
    }, [linkedinUrl, onDataParsed]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && status !== 'loading') {
            handleImport();
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Area */}
            <motion.div
                className={`relative border-2 rounded-2xl p-8 text-center transition-all duration-200 ${status === 'success'
                        ? 'border-green-500 bg-green-500/5'
                        : status === 'error'
                            ? 'border-red-500 bg-red-500/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
            >
                {status === 'idle' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#0A66C2]/10 flex items-center justify-center">
                            <Linkedin className="w-8 h-8 text-[#0A66C2]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Import from LinkedIn</h3>
                        <p className="text-muted-foreground mb-6">
                            Enter your LinkedIn profile URL to import your data automatically
                        </p>

                        <div className="flex gap-2 max-w-md mx-auto">
                            <div className="relative flex-1">
                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={linkedinUrl}
                                    onChange={e => setLinkedinUrl(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="linkedin.com/in/your-profile"
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleImport}>
                                Import
                            </Button>
                        </div>
                    </>
                )}

                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                        <h3 className="text-xl font-semibold mb-2">Fetching Your Profile...</h3>
                        <p className="text-muted-foreground">
                            Importing your experience, education, and skills from LinkedIn
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <h3 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-400">
                            Profile Imported Successfully!
                        </h3>
                        <p className="text-muted-foreground">
                            Your LinkedIn data has been imported. Review your information below.
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-400">
                            Import Failed
                        </h3>
                        <p className="text-muted-foreground mb-4">{errorMessage}</p>
                        <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
                            Try Again
                        </Button>
                    </>
                )}
            </motion.div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-xl p-6">
                <h4 className="font-semibold mb-3">How to find your LinkedIn URL:</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">1</span>
                        Go to your LinkedIn profile page
                    </li>
                    <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">2</span>
                        Copy the URL from your browser&apos;s address bar
                    </li>
                    <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">3</span>
                        Paste it in the input field above
                    </li>
                </ol>

                <div className="mt-4 p-3 bg-background rounded-lg">
                    <p className="text-xs text-muted-foreground">
                        <strong>Example:</strong> https://www.linkedin.com/in/your-username
                    </p>
                </div>
            </div>
        </div>
    );
}
