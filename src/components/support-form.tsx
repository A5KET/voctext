'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { StripeProvider } from '@/components/providers/stripe-provider'
import { redirect } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { fetchPaymentSession } from '@/lib/payment'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function SupportFormContent() {
    const { isSignedIn } = useAuth()
    const [selectedAmount, setSelectedAmount] = useState('5')
    const [isLoading, setIsLoading] = useState(false)

    const tiers = [
        { value: '5', label: '$5' },
        { value: '10', label: '$10' },
        { value: '25', label: '$25' },
        { value: '50', label: '$50' },
    ]

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!isSignedIn) {
            redirect('/sign-in')
        }

        setIsLoading(true)

        try {
            const { sessionId } = (await fetchPaymentSession(Number(selectedAmount))).data
            const stripe = await stripePromise

            if (!stripe) {
                console.error('missing stripe')
                return
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId,
            })

            if (error) {
                console.error('Payment failed')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Support Our Work</CardTitle>
                <CardDescription className="text-lg">
                    Choose your support tier and help us keep this service running
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <RadioGroup
                        defaultValue={selectedAmount}
                        onValueChange={setSelectedAmount}
                        className="grid grid-cols-4 gap-2"
                    >
                        {tiers.map((tier) => (
                            <div key={tier.value}>
                                <RadioGroupItem
                                    value={tier.value}
                                    id={`amount-${tier.value}`}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={`amount-${tier.value}`}
                                    className="flex h-12 items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                                >
                                    {tier.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isLoading}>
                        Support with ${selectedAmount}
                    </Button>
                </CardContent>
            </form>
            <CardFooter className="justify-center text-sm text-muted-foreground">
                Secure payment powered by Stripe
            </CardFooter>
        </Card>
    )
}

export default function SupportForm() {
    return (
        <StripeProvider>
            <SupportFormContent />
        </StripeProvider>
    )
}
