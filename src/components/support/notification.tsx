import { Heart } from 'lucide-react'

export function SupportPaymentNotification() {
    return (
        <div className="rounded-lg bg-destructive/10 p-4 text-[#ef4444]">
            <div className="flex items-start gap-2 justify-center items-center">
                <Heart />
                <div className="text-2xl font-medium">Thank you for your support</div>
            </div>
        </div>
    )
}
