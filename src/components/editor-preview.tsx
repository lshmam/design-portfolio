'use client';

import { useState } from 'react';
import { Monitor, Smartphone, ExternalLink, Pencil, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MinimalTemplate from '@/components/templates/minimal';
import ModernTemplate from '@/components/templates/modern';
import CreativeTemplate from '@/components/templates/creative';
import BoldTemplate from '@/components/templates/bold';
import ElegantTemplate from '@/components/templates/elegant';
import type { PortfolioData, TemplateStyle } from '@/lib/types';

interface EditorPreviewProps {
    portfolioData: Partial<PortfolioData>;
}

const templates: Record<TemplateStyle, React.ComponentType<{ portfolio: PortfolioData }>> = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    bold: BoldTemplate,
    elegant: ElegantTemplate,
};

export default function EditorPreview({ portfolioData }: EditorPreviewProps) {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Create a complete portfolio object with defaults
    const fullPortfolio: PortfolioData = {
        id: 'preview',
        personal: {
            firstName: portfolioData.personal?.firstName || 'Your',
            lastName: portfolioData.personal?.lastName || 'Name',
            headline: portfolioData.personal?.headline || 'Your Professional Headline',
            summary: portfolioData.personal?.summary || 'Your professional summary will appear here...',
            location: portfolioData.personal?.location || 'Location',
            email: portfolioData.personal?.email || 'email@example.com',
            phone: portfolioData.personal?.phone,
            website: portfolioData.personal?.website,
            linkedinUrl: portfolioData.personal?.linkedinUrl,
            photoUrl: portfolioData.personal?.photoUrl,
        },
        experiences: portfolioData.experiences || [],
        education: portfolioData.education || [],
        skills: portfolioData.skills || [],
        projects: portfolioData.projects || [],
        templateStyle: portfolioData.templateStyle || 'modern',
        hostingOption: portfolioData.hostingOption || 'hosted',
        customDomain: portfolioData.customDomain,
        colorAccent: portfolioData.colorAccent,
        isPaid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const Template = templates[fullPortfolio.templateStyle];

    const slug = `${fullPortfolio.personal.firstName.toLowerCase()}${fullPortfolio.personal.lastName.toLowerCase()}`.replace(/\s+/g, '');

    // Fullscreen view
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-background">
                {/* Close button */}
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-background/90 hover:bg-muted rounded-full shadow-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Full Portfolio */}
                <div className="w-full h-full overflow-auto">
                    <Template portfolio={fullPortfolio} />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-muted/30">
            {/* Browser Chrome */}
            <div className="bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Device Toggle */}
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'desktop'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'mobile'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>

                    {/* URL Bar */}
                    <div className="flex-1 max-w-md mx-4">
                        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">designportfol.io/</span>
                            <span className="text-sm font-medium">{slug}</span>
                            <button className="ml-auto text-muted-foreground hover:text-foreground">
                                <Pencil className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View fullscreen"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden flex items-start justify-center p-4">
                <div
                    className={`bg-background rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${viewMode === 'mobile'
                        ? 'w-[375px] h-[667px]'
                        : 'w-full max-w-4xl h-full'
                        }`}
                    style={{
                        maxHeight: viewMode === 'desktop' ? 'calc(100vh - 200px)' : '667px'
                    }}
                >
                    <div className="w-full h-full overflow-auto">
                        <Template portfolio={fullPortfolio} />
                    </div>
                </div>
            </div>
        </div>
    );
}

