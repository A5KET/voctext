'use client'

import { Transcription } from './definitions'

export function downloadTranscription(transcription: Transcription) {
    const blob = new Blob([transcription.text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = `${transcription.title}.txt`
    downloadLink.click()
    
    URL.revokeObjectURL(url)
}