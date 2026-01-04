'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TemplateStyle } from '@/lib/types';

const styles: { id: TemplateStyle; name: string; description: string; preview: string; colors: string[] }[] = [
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, whitespace-focused design with elegant typography',
        preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
        colors: ['#000000', '#ffffff', '#666666']
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Bold bento grid layout with dark mode aesthetics',
        preview: 'bg-gradient-to-br from-slate-900 to-slate-800',
        colors: ['#6366f1', '#1e293b', '#f8fafc']
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Dynamic asymmetric layouts with vibrant animations',
        preview: 'bg-gradient-to-br from-purple-600 to-pink-500',
        colors: ['#9333ea', '#ec4899', '#fbbf24']
    },
    {
        id: 'bold',
        name: 'Bold',
        description: 'High contrast design with impactful typography',
        preview: 'bg-gradient-to-br from-black to-zinc-900',
        colors: ['#ffffff', '#000000', '#ef4444']
    },
    {
        id: 'elegant',
        name: 'Elegant',
        description: 'Refined serif typography with sophisticated aesthetics',
        preview: 'bg-gradient-to-br from-amber-50 to-orange-50',
        colors: ['#78350f', '#fef3c7', '#d97706']
    }
];

export default function StyleShowcase() {
    const [activeStyle, setActiveStyle] = useState<TemplateStyle>('modern');
    const active = styles.find(s => s.id === activeStyle)!;

    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        Design Options
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                        Choose Your <span className="gradient-text">Style</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Five professionally designed templates to match your personal brand
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Preview */}
                    <motion.div
                        key={activeStyle}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="order-2 lg:order-1"
                    >
                        <div className={`aspect-[4/3] rounded-2xl ${active.preview} p-8 relative overflow-hidden shadow-2xl`}>
                            {/* Mock Portfolio Preview */}
                            <div className="absolute inset-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-white/20" />
                                    <div>
                                        <div className="h-4 w-32 bg-white/30 rounded mb-2" />
                                        <div className="h-3 w-24 bg-white/20 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-white/20 rounded" />
                                    <div className="h-3 w-4/5 bg-white/20 rounded" />
                                    <div className="h-3 w-3/5 bg-white/20 rounded" />
                                </div>
                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="aspect-square rounded-lg bg-white/10" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Color Palette */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <span className="text-sm text-muted-foreground">Color palette:</span>
                            {active.colors.map((color, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Style Selector */}
                    <div className="order-1 lg:order-2 space-y-4">
                        {styles.map((style) => (
                            <motion.button
                                key={style.id}
                                onClick={() => setActiveStyle(style.id)}
                                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${activeStyle === style.id
                                        ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]'
                                        : 'bg-card border border-border hover:border-primary/50'
                                    }`}
                                whileHover={{ x: activeStyle === style.id ? 0 : 5 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{style.name}</h3>
                                        <p className={`text-sm ${activeStyle === style.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                            {style.description}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-lg ${style.preview} shrink-0`} />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
