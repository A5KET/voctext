import axios from 'axios'
import { z } from 'zod'

const MAX_FILE_SIZE = 25 * 1024 * 1024
const SUPPORTED_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/x-m4a']

export const fileUploadSchema = z.object({
    file: z
        .custom<File>((file) => file instanceof File, {
            message: 'The uploaded file is invalid',
        })
        .refine((file) => SUPPORTED_FORMATS.includes(file.type), {
            message: 'Invalid file format. Supported formats: MP3, WAV, M4A',
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'File size must not exceed 25MB',
        }),
})

interface TranscriptionData {
    language: string
    duration: number
    text: string
}

const api = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
})

export async function fetchFileTranscription(file: File): Promise<TranscriptionData> {
    const formData = new FormData()
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'verbose_json')
    formData.append('file', file)

    const response = await api.post('/audio/transcriptions', formData)

    return response.data
}
