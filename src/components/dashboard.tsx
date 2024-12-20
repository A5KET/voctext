'use client'

import { Transcription } from '@/lib/definitions'
import { useState } from 'react'
import DashboardSidebar from '@/components/dashboard-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import DashboardTranscription from './dashboard-transcription'

export default function Dashboard({ transcriptions }: { transcriptions: Transcription[] }) {
    const [selectedTranscription, setSelectedTranscription] = useState<Transcription | undefined>(undefined)

    return (
        <>
            <SidebarProvider>
                <DashboardSidebar
                    transcriptions={transcriptions}
                    onSelect={(transcription) => setSelectedTranscription(transcription)}
                    selectedTranscription={selectedTranscription}
                />
                {selectedTranscription ? (
                    <DashboardTranscription transcription={selectedTranscription} />
                ) : (
                    <SidebarInset className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold">Select a transcription</h1>
                            <p className="text-sm text-muted-foreground">
                                Choose a file from the sidebar to view its transcription
                            </p>
                        </div>
                    </SidebarInset>
                )}
            </SidebarProvider>
        </>
    )
}

export const metadata = {
    title: 'Dashboard - Voctext',
}
