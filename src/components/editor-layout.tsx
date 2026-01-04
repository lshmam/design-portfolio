'use client';

import { useState } from 'react';
import { ArrowLeft, Rocket, Loader2, Check, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EditorSidebar from '@/components/editor-sidebar';
import EditorPreview from '@/components/editor-preview';
import TemplateSelector from '@/components/template-selector';
import type { PortfolioData, TemplateStyle } from '@/lib/types';

interface EditorLayoutProps {
    data: Partial<PortfolioData>;
    onChange: (data: Partial<PortfolioData>) => void;
    onCheckout: () => void;
}

interface PublishResult {
    success: boolean;
    url: string;
    slug: string;
}

export default function EditorLayout({ data, onChange }: EditorLayoutProps) {
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
    const [copied, setCopied] = useState(false);

    const handleTemplateSelect = (template: TemplateStyle) => {
        onChange({ ...data, templateStyle: template });
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const response = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioData: data })
            });

            const result = await response.json();

            if (result.success) {
                setPublishResult({
                    success: true,
                    url: result.url,
                    slug: result.slug,
                });
            }
        } catch (error) {
            console.error('Publish error:', error);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleCopyUrl = () => {
        if (publishResult?.url) {
            navigator.clipboard.writeText(publishResult.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Success state after publishing
    if (publishResult) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Your portfolio is live! 🎉</h1>
                    <p className="text-muted-foreground mb-8">
                        Share your portfolio with the world. Your page is now accessible at:
                    </p>

                    <div className="bg-muted rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="flex-1 text-sm font-mono truncate">
                                {publishResult.url}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyUrl}
                                className="shrink-0"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Button asChild>
                            <a href={publishResult.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Portfolio
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">D</span>
                        </div>
                        <span className="font-semibold">DesignPortfol.io</span>
                    </div>
                </div>

                <Button onClick={handlePublish} disabled={isPublishing} className="gap-2">
                    {isPublishing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                        </>
                    ) : (
                        <>
                            <Rocket className="w-4 h-4" />
                            Publish — Free
                        </>
                    )}
                </Button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 shrink-0 overflow-hidden">
                    <EditorSidebar
                        data={data}
                        onChange={onChange}
                        onOpenTemplateSelector={() => setShowTemplateSelector(true)}
                    />
                </div>

                {/* Preview */}
                <div className="flex-1 overflow-hidden">
                    <EditorPreview portfolioData={data} />
                </div>
            </div>

            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <TemplateSelector
                    currentTemplate={data.templateStyle || 'modern'}
                    onSelect={handleTemplateSelect}
                    onClose={() => setShowTemplateSelector(false)}
                />
            )}
        </div>
    );
}
