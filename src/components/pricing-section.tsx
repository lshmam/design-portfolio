'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
    'Upload LinkedIn export (ZIP/CSV)',
    '5 stunning design templates',
    'Mobile-responsive portfolio',
    'Custom color accents',
    'Hosted on our domain',
    'Optional custom domain support',
    'SEO optimized',
    'Lifetime access — no subscriptions'
];

export default function PricingSection() {
    return (
        <section className="py-24 relative">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        Simple Pricing
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                        One Price. <span className="gradient-text">No Surprises.</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />

                    {/* Card */}
                    <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Left: Price */}
                            <div className="text-center md:text-left">
                                <div className="text-sm text-muted-foreground mb-2">One-time payment</div>
                                <div className="flex items-baseline justify-center md:justify-start gap-2">
                                    <span className="text-6xl md:text-7xl font-bold gradient-text">$10</span>
                                </div>
                                <p className="text-muted-foreground mt-4">
                                    No monthly fees. No hidden costs.<br />
                                    Your portfolio is yours forever.
                                </p>

                                <div className="mt-8">
                                    <Link href="/create">
                                        <Button size="lg" className="w-full md:w-auto text-lg px-8 py-6 glow">
                                            Get Started Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Features */}
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-500" />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
