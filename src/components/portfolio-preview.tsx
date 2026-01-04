'use client';

import { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MinimalTemplate from '@/components/templates/minimal';
import ModernTemplate from '@/components/templates/modern';
import CreativeTemplate from '@/components/templates/creative';
import BoldTemplate from '@/components/templates/bold';
import ElegantTemplate from '@/components/templates/elegant';
import type { PortfolioData, TemplateStyle } from '@/lib/types';

interface PortfolioPreviewProps {
    portfolioData: Partial<PortfolioData>;
    onClose?: () => void;
}

const templates: Record<TemplateStyle, React.ComponentType<{ portfolio: PortfolioData }>> = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    bold: BoldTemplate,
    elegant: ElegantTemplate,
};

export default function PortfolioPreview({ portfolioData, onClose }: PortfolioPreviewProps) {
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

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-background">
                {/* Fullscreen Controls */}
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setIsFullscreen(false)}
                        className="bg-white/90 hover:bg-white shadow-lg"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </Button>
                    {onClose && (
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={onClose}
                            className="bg-white/90 hover:bg-white shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Full Portfolio */}
                <div className="w-full h-full overflow-auto">
                    <Template portfolio={fullPortfolio} />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Preview Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Live Preview — {fullPortfolio.templateStyle} template</h3>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFullscreen(true)}
                    >
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Fullscreen
                    </Button>
                </div>
            </div>

            {/* Preview Frame */}
            <div className="relative border border-border rounded-xl overflow-hidden shadow-2xl">
                {/* Browser Chrome */}
                <div className="bg-muted/80 px-4 py-2 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                        <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground">
                            designportfol.io/{fullPortfolio.personal.firstName.toLowerCase()}-{fullPortfolio.personal.lastName.toLowerCase()}
                        </div>
                    </div>
                </div>

                {/* Scrollable Preview */}
                <div className="h-[600px] overflow-auto">
                    <Template portfolio={fullPortfolio} />
                </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
                Scroll to see the full portfolio • Click &quot;Fullscreen&quot; for a better view
            </p>
        </div>
    );
}
