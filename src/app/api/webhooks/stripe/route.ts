import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { markPortfolioAsPaid } from '@/lib/portfolio-store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const portfolioId = session.metadata?.portfolioId;

        if (portfolioId) {
            markPortfolioAsPaid(portfolioId);
            console.log(`Portfolio ${portfolioId} marked as paid`);
        }
    }

    return NextResponse.json({ received: true });
}
