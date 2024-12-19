import { NextRequest, NextResponse } from 'next/server'

import { fetchFileTranscription as fetchRawFileTranscription, fileUploadSchema } from '@/lib/transcription'
import { ZodError } from 'zod'
import { Transcription, TranscriptionRequestStatus } from '@/lib/definitions'
import {
    confirmTranscriptionRequest,
    createTranscription,
    createTranscriptionRequest,
    setTranscriptionRequestError,
} from '@/lib/data'
import { auth } from '@clerk/nextjs/server'
import { AxiosError } from 'axios'

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const { userId } = await auth()

    const transcriptionRequest = await createTranscriptionRequest({
        userId,
        status: TranscriptionRequestStatus.PROCESSING,
    })

    let data

    try {
        data = fileUploadSchema.parse({
            file: formData.get('file'),
        })
    } catch (error) {
        if (error instanceof ZodError) {
            await setTranscriptionRequestError(transcriptionRequest, error.message)

            return NextResponse.json({ error: error.errors }, { status: 400 })
        }

        throw error
    }

    try {
        const rawTranscription = await fetchRawFileTranscription(data.file)
        const transcription = await createTranscription({
            text: rawTranscription.text,
            duration: rawTranscription.duration,
            language: rawTranscription.language,
            title: data.file.name,
            userId,
        })

        await confirmTranscriptionRequest(transcriptionRequest, transcription, data.file.name)

        return NextResponse.json<{ data: Transcription }>({
            data: transcription,
        })
    } catch (error) {
        if (error instanceof AxiosError) {
            await setTranscriptionRequestError(transcriptionRequest, error.message)

            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }

        throw error
    }
}
