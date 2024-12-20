'use client'

import { useState, useEffect, useRef } from 'react'
import { Download } from 'lucide-react'

import { Transcription } from '@/lib/definitions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '../ui/card'
import { downloadTranscription } from '@/lib/download'

export interface TranscriptionViewerProps {
    transcription: Transcription
}

export default function TranscriptionViewer({ transcription }: TranscriptionViewerProps) {
    const OVERFLOW_THRESHOLD = 600
    const [isOverflowing, setIsOverflowing] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const textRef = useRef<HTMLParagraphElement | null>(null)
    const wordsCount = transcription.text.split(' ').length

    function formatDuration(duration: number) {
        const minutes = Math.floor(duration / 60)
        const seconds = (duration % 60).toFixed(1)

        if (minutes > 0) {
            return `${minutes}m ${seconds}s`
        }
        return `${seconds}s`
    }

    const handleDownload = downloadTranscription.bind(null, transcription)

    useEffect(() => {
        if (textRef.current) {
            if (textRef.current) {
                setIsOverflowing(textRef.current.scrollHeight > OVERFLOW_THRESHOLD)
            }
        }
    }, [transcription.text])

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-6">
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
                    <div className={`relative ${!isExpanded ? 'max-h-[18rem] overflow-hidden' : ''}`}>
                        <p ref={textRef} className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {transcription.text}
                        </p>
                        {!isExpanded && isOverflowing && (
                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-background to-transparent" />
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-5">
                        {isOverflowing && (
                            <Button
                                variant="link"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-blue-500 p-0 h-auto font-normal"
                            >
                                {isExpanded ? 'Show less' : 'Show more'}
                            </Button>
                        )}
                        <Button
                            variant="default"
                            onClick={handleDownload}
                            className="bg-blue-500 hover:bg-blue-600 ml-auto"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Transcription
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
