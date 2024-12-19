'use client'

import { useState } from 'react'
import AudioUpload from '../components/audio-upload'
import axios from 'axios'
import TranscriptionViewer from '@/components/transcription-viewer'
import { Transcription } from '@/lib/definitions'

export default function Home() {
    const [transcription, setTranscription] = useState<null | Transcription>(null)

    async function onAudioFileUpload(file: File) {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            setTranscription(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className="min-h-screen flex flex-col h-screen">
            <header className="flex justify-center p-6 md:p-10">
                <h1 className="text-4xl font-bold">Audio Transcription</h1>
            </header>
            <AudioUpload onFileUploadAction={onAudioFileUpload} />
            {transcription ? <TranscriptionViewer transcription={transcription} /> : null}
        </main>
    )
}
