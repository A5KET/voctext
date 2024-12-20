import { fetchTranscriptions } from '@/lib/data'
import { auth } from '@clerk/nextjs/server'
import Dashboard from '@/components/dashboard/dashboard'


export default async function Page() {
    const { userId } = await auth()

    if (!userId) {
        throw Error('missing user')
    }

    const transcirptions = await fetchTranscriptions(userId)

    return <Dashboard transcriptions={transcirptions} />
}

export const metadata = {
    title: 'Dashboard - Voctext',
}
