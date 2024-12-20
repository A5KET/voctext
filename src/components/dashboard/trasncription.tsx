'use client'

import { Download } from 'lucide-react'

import { Transcription } from '@/lib/definitions'
import { Button } from '../ui/button'
import { CardContent } from '../ui/card'
import { downloadTranscription } from '@/lib/download'
import { formatDuration } from '@/lib/utils'

export interface TranscriptionViewerProps {
    transcription: Transcription
}

export default function DashboardTranscription({ transcription }: TranscriptionViewerProps) {
    const wordsCount = transcription.text.split(' ').length

    const handleDownload = downloadTranscription.bind(null, transcription)

    return (
        <>
            <CardContent className="p-6 flex flex-col">
                <div className="flex pb-5">
                    <div className="text-xl font-bold">{transcription.title}</div>
                    <Button
                        variant="default"
                        onClick={handleDownload}
                        className="bg-blue-500 hover:bg-blue-600 w-fit ml-auto"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Transcription
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <h3 className="text-sm font-medium font-bold text-muted-foreground">Language</h3>
                        <p className="mt-1 font-semibold font-mono">{transcription.language}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                        <p className="mt-1 font-semibold font-mono">{formatDuration(transcription.duration)}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Words</h3>
                        <p className="mt-1 font-semibold font-mono">{wordsCount.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-4 relative">
                    <div className={`relative max-h-72 overflow-y-auto'`}>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{transcription.text}</p>
                    </div>
                    <div className="flex justify-between items-center mt-5"></div>
                </div>
            </CardContent>
        </>
    )
}
