'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between glass rounded-2xl px-6 py-3">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl">DesignPortfol.io</span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            How It Works
                        </Link>
                        <Link href="#styles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Styles
                        </Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                    </nav>

                    {/* CTA */}
                    <Link href="/create">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
