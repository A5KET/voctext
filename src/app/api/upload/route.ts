import { NextRequest, NextResponse } from 'next/server'

import { fetchFileTranscription, fileUploadSchema } from '@/lib/upload'
import { ZodError } from 'zod'
import { getCurrentTime } from '@/lib/utils'
import { Transcription } from '@/lib/definitions'

export async function POST(request: NextRequest) {
    const formData = await request.formData()

    try {
        const data = fileUploadSchema.parse({
            file: formData.get('file'),
        })

        const transcription = await fetchFileTranscription(data.file)
        const date = getCurrentTime()
        const title = data.file.name

        return NextResponse.json<{ data: Transcription }>({
            data: {
                id: 0,
                language: transcription.language,
                text: transcription.text,
                duration: transcription.duration,
                title,
                date,
            },
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 })
        }

        console.error(error)

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
