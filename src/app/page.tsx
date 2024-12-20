'use client'

import { useState } from 'react'
import AudioUpload from '../components/audio-upload'
import TranscriptionViewer from '@/components/transcription-viewer'
import { Transcription } from '@/lib/definitions'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Text } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { uploadFile } from '@/lib/upload'
import Head from './head'

export default function Home() {
    const router = useRouter()
    const [isLoadingTranscription, setIsLoadingTranscription] = useState(false)
    const [transcription, setTranscription] = useState<null | Transcription>(null)

    async function onAudioFileUpload(file: File) {
        setTranscription(null)
        setIsLoadingTranscription(true)

        const transcription = await uploadFile(file)

        setTranscription(transcription)
        setIsLoadingTranscription(false)
    }

    function handlerDashboardRedirect() {
        console.log('here')
        router.push('/dashboard')
    }

    return (
        <>
            <Head />
            <div className="flex justify-center">
                <div className="min-h-screen p-5">
                    <header className="flex justify-center flex-col">
                        <nav className="flex flex-1 justify-end">
                            <SignedOut>
                                <SignInButton>
                                    <Button size="default">Sign In</Button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton>
                                    <UserButton.MenuItems>
                                        <UserButton.Action
                                            label="Transcriptions"
                                            labelIcon={<Text />}
                                            onClick={handlerDashboardRedirect}
                                        />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </SignedIn>
                        </nav>
                        <h1 className="text-4xl font-bold pt-10 mx-auto">Audio Transcription</h1>
                    </header>
                    <main className="flex flex-col items-center min-h-screen">
                        <div>
                            <AudioUpload onFileUploadAction={onAudioFileUpload} />
                            {transcription ? <TranscriptionViewer transcription={transcription} /> : null}
                        </div>
                        {isLoadingTranscription ? <p>Loading...</p> : null}
                    </main>
                </div>
            </div>
        </>
    )
}
