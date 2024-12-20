import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createPayment } from '@/lib/data'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    let event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        console.error(`Webhook signature verification failed: ${(err as Error).message}`)
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const { payment_intent, amount_total, status } = session
        const { userId } = session.metadata as { userId: string }

        if (!payment_intent || amount_total == null || !status || !userId) {
            console.error(`Missing session data`, session)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }

        try {
            await createPayment({
                userId,
                paymentIntentId: payment_intent.toString(),
                status: status,
                amount: amount_total,
            })
        } catch (error) {
            console.error('Error saving payment to database:', error)
            return NextResponse.json({ error: 'Error saving payment' }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true })
}
