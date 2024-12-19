import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="max-w-md w-full p-6 bg-card rounded-md">
                <SignUp />
            </div>
        </div>
    )
}