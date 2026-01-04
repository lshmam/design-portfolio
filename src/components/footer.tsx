'use client';

import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-12 border-t border-border">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl">DesignPortfol.io</span>
                    </Link>

                    {/* Copyright */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in 2024
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
