'use client';

import { motion } from 'framer-motion';
import { Upload, Palette, CreditCard, Globe } from 'lucide-react';

const steps = [
    {
        icon: Upload,
        title: 'Export Your LinkedIn',
        description: 'Download your data from LinkedIn Settings → Data Privacy → Get a copy of your data',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Palette,
        title: 'Choose Your Style',
        description: 'Pick from 5 stunning design templates: Minimal, Modern, Creative, Bold, or Elegant',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: CreditCard,
        title: 'One-Time Payment',
        description: 'Just $10 — no subscriptions, no hidden fees. Your portfolio is yours forever.',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: Globe,
        title: 'Go Live Instantly',
        description: 'Get a unique URL on our domain or connect your own custom domain',
        color: 'from-orange-500 to-red-500'
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative">
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
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        From LinkedIn export to live portfolio in under 5 minutes
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 h-full">
                                {/* Step Number */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} p-3 mb-4`}>
                                    <step.icon className="w-full h-full text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
