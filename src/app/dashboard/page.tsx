import { Sidebar } from '@/components/sidebar'
import SidebarTranscription from '@/components/sidebar-transcription'
import { fetchTranscriptions } from '@/lib/data'
import { auth } from '@clerk/nextjs/server'

export default async function Home() {
    const { userId } = await auth()

    if (!userId) {
        throw Error('Missing user')
    }

    const trasncriptions = await fetchTranscriptions(userId)

    return (
        <>
            <Sidebar>
                {trasncriptions.map((transcription) => {
                    return <SidebarTranscription transcription={transcription} key={transcription.id}/>
                })}
            </Sidebar>
        </>
    )
}
