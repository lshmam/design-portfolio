'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const portfolioId = searchParams.get('portfolio_id');
    const [copied, setCopied] = useState(false);

    const portfolioUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/${portfolioId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(portfolioUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Confetti effect
    useEffect(() => {
        const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#f472b6'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}vw;
          top: -10px;
          border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
          pointer-events: none;
          z-index: 1000;
          animation: confetti-fall 3s ease-out forwards;
        `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 20);
        }

        // Add keyframes
        const style = document.createElement('style');
        style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
        document.head.appendChild(style);

        return () => style.remove();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg w-full text-center"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>

                {/* Heading */}
                <h1 className="text-4xl font-bold mb-4">
                    Payment <span className="gradient-text">Successful!</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Your portfolio is now live and ready to share
                </p>

                {/* Portfolio URL */}
                <div className="bg-muted/50 rounded-xl p-6 mb-8">
                    <div className="text-sm text-muted-foreground mb-2">Your portfolio URL</div>
                    <div className="flex items-center gap-2 bg-background rounded-lg p-3">
                        <code className="flex-1 text-sm truncate">{portfolioUrl}</code>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyToClipboard}
                            className="shrink-0"
                        >
                            {copied ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={`/portfolio/${portfolioId}`}>
                        <Button size="lg" className="w-full sm:w-auto">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Portfolio
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span>Thank you for choosing DesignPortfol.io</span>
                </div>
            </motion.div>
        </div>
    );
}
