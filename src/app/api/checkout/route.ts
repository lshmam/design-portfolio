import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createPortfolio } from '@/lib/portfolio-store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { portfolioData } = body;

        // Create portfolio in our store
        const portfolio = createPortfolio(portfolioData);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Portfolio Generation',
                            description: `${portfolio.templateStyle} style portfolio for ${portfolio.personal.firstName} ${portfolio.personal.lastName}`,
                        },
                        unit_amount: 1000, // $10.00 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&portfolio_id=${portfolio.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/create`,
            metadata: {
                portfolioId: portfolio.id,
            },
        });

        return NextResponse.json({ url: session.url, portfolioId: portfolio.id });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
