import { AudioLines } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Transcription } from '@/lib/definitions'

export interface SidebarTranscriptionProps {
    transcription: Transcription
}

export default function SidebarTranscription({ transcription }: SidebarTranscriptionProps) {
    return (
        <Button key={transcription.id} variant="ghost" className="w-full justify-start text-left">
            <AudioLines className="mr-2 h-4 w-4" />
            <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{transcription.title}</span>
                <span className="text-xs text-muted-foreground">{transcription.createdAt.toISOString()}</span>
            </div>
        </Button>
    )
}
