import { NextRequest, NextResponse } from 'next/server'

import { fetchFileTranscription as fetchRawFileTranscription, fileUploadSchema } from '@/lib/transcription'
import { ZodError } from 'zod'
import { Transcription, TranscriptionRequestStatus } from '@/lib/definitions'
import {
    checkIsUserSupporter,
    confirmTranscriptionRequest,
    createTranscription,
    createTranscriptionRequest,
    fetchUserTranscriptionCounter as fetchUserTranscriptionCount,
    setTranscriptionRequestError,
} from '@/lib/data'
import { auth } from '@clerk/nextjs/server'
import { AxiosError } from 'axios'

const MAX_FREE_TRANSCRIPTIONS_COUNT = 2

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const { userId } = await auth()
    let transcriptionCount
    let isUserSupporter

    if (!userId) {
        const cookies = request.cookies
        transcriptionCount = parseInt(cookies.get('transcriptionCount')?.value || '0', 10)
        isUserSupporter = false
    } else {
        transcriptionCount = await fetchUserTranscriptionCount(userId)
        isUserSupporter = await checkIsUserSupporter(userId)
    }

    if (transcriptionCount >= MAX_FREE_TRANSCRIPTIONS_COUNT && !isUserSupporter) {
        return NextResponse.json(
            { error: 'You have reached the limit of free records. Please support to continue.' },
            { status: 400 }
        )
    }

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

        const response = NextResponse.json<{ data: Transcription }>({
            data: transcription,
        })

        response.cookies.set('transcriptionCount', String(transcriptionCount + 1), { maxAge: 60 * 60 * 24 * 7 })

        return response
    } catch (error) {
        if (error instanceof AxiosError) {
            await setTranscriptionRequestError(transcriptionRequest, error.message)

            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }

        throw error
    }
}
