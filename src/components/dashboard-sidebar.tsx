'use client'

import { FileAudio } from 'lucide-react'
import { Transcription } from '@/lib/definitions'
import TranscriptionItem from '@/components/transcription-item'
import { Button } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'
import Link from 'next/link'

export interface DashboardSidebarProps {
    transcriptions: Transcription[]
    selectedTranscription?: Transcription
    onSelect: (transcription: Transcription) => void
}

export default function DashboardSidebar({ transcriptions, selectedTranscription, onSelect }: DashboardSidebarProps) {
    return (
        <Sidebar>
            <SidebarHeader className="flex flex-col gap-2 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <FileAudio className="h-6 w-6" />
                            <span className="font-semibold">Transcriptions</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <Link href="/">
                    <Button className="w-full justify-start">
                        <FileAudio className="mr-2 h-4 w-4" />
                        New transcription
                    </Button>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Recent Files</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {transcriptions.map((transcription) => (
                                <TranscriptionItem
                                    key={transcription.id}
                                    transcription={transcription}
                                    isSelected={transcription == selectedTranscription}
                                    onClick={() => onSelect(transcription)}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
