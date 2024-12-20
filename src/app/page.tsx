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
import { UploadError } from '@/components/upload-error'

export default function Page() {
    const router = useRouter()
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isLoadingTranscription, setIsLoadingTranscription] = useState(false)
    const [transcription, setTranscription] = useState<null | Transcription>(null)

    async function onAudioFileUpload(file: File) {
        setUploadError(null)
        setTranscription(null)
        setIsLoadingTranscription(true)

        try {
            const transcription = await uploadFile(file)
            setTranscription(transcription)
        } catch (error) {
            if ((error as Error).message) {
                setUploadError((error as Error).message)
            }

            throw error
        }

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
                <div className="p-5">
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
                        <h1 className="text-4xl font-bold p-5 mx-auto">Voctext</h1>
                        <h2 className="text-3xl mx-auto">Audio Transcription</h2>
                    </header>
                    <main className="flex flex-col items-center">
                        <div>
                            <AudioUpload onFileUploadAction={onAudioFileUpload} onUploadError={setUploadError}/>
                            {uploadError ? <UploadError error={uploadError} /> : null}
                            {transcription ? <TranscriptionViewer transcription={transcription} /> : null}
                        </div>
                        {isLoadingTranscription ? <p>Loading...</p> : null}
                    </main>
                </div>
            </div>
        </>
    )
}
