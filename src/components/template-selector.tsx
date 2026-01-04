'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TemplateStyle } from '@/lib/types';

interface TemplateSelectorProps {
    currentTemplate: TemplateStyle;
    onSelect: (template: TemplateStyle) => void;
    onClose: () => void;
}

const templates: { id: TemplateStyle; name: string; description: string; preview: string }[] = [
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple',
        preview: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Sleek dark theme',
        preview: 'bg-gradient-to-br from-slate-900 to-slate-800'
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Bold and colorful',
        preview: 'bg-gradient-to-br from-purple-600 to-pink-500'
    },
    {
        id: 'bold',
        name: 'Bold',
        description: 'High contrast',
        preview: 'bg-gradient-to-br from-black to-zinc-900'
    },
    {
        id: 'elegant',
        name: 'Elegant',
        description: 'Warm and refined',
        preview: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
];

export default function TemplateSelector({ currentTemplate, onSelect, onClose }: TemplateSelectorProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div>
                        <h2 className="text-lg font-semibold">Choose Template</h2>
                        <p className="text-sm text-muted-foreground">Select a style for your portfolio</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Templates Grid */}
                <div className="p-4 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {templates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    onSelect(template.id);
                                    onClose();
                                }}
                                className={`group p-3 rounded-xl border-2 transition-all text-left ${currentTemplate === template.id
                                        ? 'border-primary shadow-lg ring-2 ring-primary/20'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                {/* Preview */}
                                <div className={`aspect-[4/3] rounded-lg mb-3 ${template.preview} relative overflow-hidden`}>
                                    {/* Simple mockup elements */}
                                    <div className="absolute inset-4 flex flex-col items-center justify-center">
                                        <div className={`w-8 h-8 rounded-full mb-2 ${template.id === 'modern' || template.id === 'bold' ? 'bg-white/20' : 'bg-gray-300'
                                            }`} />
                                        <div className={`w-16 h-2 rounded mb-1 ${template.id === 'modern' || template.id === 'bold' ? 'bg-white/30' : 'bg-gray-400'
                                            }`} />
                                        <div className={`w-12 h-1.5 rounded ${template.id === 'modern' || template.id === 'bold' ? 'bg-white/20' : 'bg-gray-300'
                                            }`} />
                                    </div>

                                    {/* Selected checkmark */}
                                    {currentTemplate === template.id && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="font-medium text-sm">{template.name}</div>
                                <div className="text-xs text-muted-foreground">{template.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
