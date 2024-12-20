import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const domain = process.env.NEXT_PUBLIC_DOMAIN

export async function POST(request: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unathorized ' }, { status: 401 })
    }

    const { amount }: { amount: number } = await request.json()

    if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Project Support',
                        },
                        unit_amount: amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${domain}/?payment_session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/`,
            metadata: { userId },
        })

        console.log(session.id)

        return NextResponse.json({ sessionId: session.id }, { status: 200 })
    } catch (error) {
        console.error(error)

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}