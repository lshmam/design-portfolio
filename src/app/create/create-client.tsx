'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LinkedInUploader from '@/components/linkedin-uploader';
import EditorLayout from '@/components/editor-layout';
import type { PortfolioData } from '@/lib/types';
import { savePortfolio } from '@/app/actions/portfolio';

type ViewState = 'upload' | 'editor';

interface CreatePageClientProps {
    userEmail: string;
    userId: string;
    existingPortfolio: PortfolioData | null;
}

export default function CreatePageClient({ userEmail, userId, existingPortfolio }: CreatePageClientProps) {
    // If user has existing portfolio, go directly to editor
    const [viewState, setViewState] = useState<ViewState>(existingPortfolio ? 'editor' : 'upload');
    const [portfolioData, setPortfolioData] = useState<Partial<PortfolioData>>(
        existingPortfolio || {
            personal: {
                firstName: '',
                lastName: '',
                headline: '',
                summary: '',
                location: '',
                email: userEmail,
            },
            experiences: [],
            education: [],
            skills: [],
            projects: [],
            templateStyle: 'modern',
            hostingOption: 'hosted',
        }
    );

    const handleDataParsed = async (data: Partial<PortfolioData>) => {
        const newData = { ...portfolioData, ...data };
        setPortfolioData(newData);
        setViewState('editor');

        // Auto-save to Supabase
        try {
            await savePortfolio(newData);
        } catch (error) {
            console.error('Failed to auto-save portfolio:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioData, userId })
            });

            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    // Show the full editor layout if user has existing portfolio or after data import
    if (viewState === 'editor') {
        return (
            <EditorLayout
                data={portfolioData}
                onChange={setPortfolioData}
                onCheckout={handleCheckout}
            />
        );
    }

    // Initial upload screen (only for new users)
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl">DesignPortfol.io</span>
                    </Link>
                    <span className="text-sm text-muted-foreground">{userEmail}</span>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold mb-2">Basic information</h1>
                        <p className="text-muted-foreground mb-8">
                            Import your information from your LinkedIn profile to quickly create your DesignPortfol.io page.
                        </p>

                        <LinkedInUploader onDataParsed={handleDataParsed} />

                        <div className="mt-8 text-center">
                            <Button variant="ghost" onClick={() => setViewState('editor')}>
                                Or enter manually →
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
