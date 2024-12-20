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
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'

const MAX_FREE_TRANSCRIPTIONS_COUNT = 2

async function getTranscriptionCountAndSupportStatus(userId: string | null, cookies: RequestCookies) {
    if (!userId) {
        const transcriptionCount = parseInt(cookies.get('transcriptionCount')?.value || '0', 10)
        return { transcriptionCount, isUserSupporter: false }
    }

    const transcriptionCount = await fetchUserTranscriptionCount(userId)
    const isUserSupporter = await checkIsUserSupporter(userId)

    return { transcriptionCount, isUserSupporter }
}

async function handleFileUpload(formData: FormData) {
    try {
        const data = fileUploadSchema.parse({
            file: formData.get('file'),
        })
        return data
    } catch (error) {
        if (error instanceof ZodError) {
            throw error
        }
        throw error
    }
}

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    const { transcriptionCount, isUserSupporter } = await getTranscriptionCountAndSupportStatus(userId, request.cookies)

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
        data = await handleFileUpload(await request.formData())
    } catch (error) {
        if (error instanceof ZodError) {
            await setTranscriptionRequestError(transcriptionRequest, error.message)

            return NextResponse.json({ error: error.errors }, { status: 400 })
        }

        throw error
    }

    let rawTranscription

    try {
        rawTranscription = await fetchRawFileTranscription(data.file)
    } catch (error) {
        if (error instanceof AxiosError) {
            await setTranscriptionRequestError(transcriptionRequest, error.message)
        }

        throw error
    }

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

    if (!userId) {
        response.cookies.set('transcriptionCount', String(transcriptionCount + 1), { maxAge: 60 * 60 * 24 * 7 })
    }

    return response
}
