import { ClerkProvider } from '@clerk/nextjs'
import '@/components/ui/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: 'hsl(263.4, 70%, 50.4%)'
                },
            }}
        >
            <html lang="en">
                <body>{children}</body>
            </html>
        </ClerkProvider>
    )
}
