'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LinkedInUploader from '@/components/linkedin-uploader';
import EditorLayout from '@/components/editor-layout';
import type { PortfolioData } from '@/lib/types';

type ViewState = 'upload' | 'editor';

export default function CreatePage() {
    const [viewState, setViewState] = useState<ViewState>('upload');
    const [portfolioData, setPortfolioData] = useState<Partial<PortfolioData>>({
        personal: {
            firstName: '',
            lastName: '',
            headline: '',
            summary: '',
            location: '',
            email: '',
        },
        experiences: [],
        education: [],
        skills: [],
        projects: [],
        templateStyle: 'modern',
        hostingOption: 'hosted',
    });

    const handleDataParsed = (data: Partial<PortfolioData>) => {
        setPortfolioData(prev => ({ ...prev, ...data }));
        setViewState('editor');
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioData })
            });

            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    // Show the full editor layout after data import
    if (viewState === 'editor') {
        return (
            <EditorLayout
                data={portfolioData}
                onChange={setPortfolioData}
                onCheckout={handleCheckout}
            />
        );
    }

    // Initial upload screen
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
