'use client'

import { AudioWaveformIcon as Waveform } from 'lucide-react'
import { Transcription } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

interface TranscriptionItemProps {
    transcription: Transcription
    isSelected: boolean
    onClick: () => void
}

export default function TranscriptionItem({ transcription, isSelected, onClick }: TranscriptionItemProps) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton isActive={isSelected} onClick={onClick}>
                <Waveform className="h-4 w-6 shrink-0" />
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{transcription.title}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                        {formatDate(transcription.createdAt)}
                    </span>
                </div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
