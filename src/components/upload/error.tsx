import { XCircle } from 'lucide-react'

interface UploadErrorProps {
    error: string
}

export function UploadError({ error }: UploadErrorProps) {
    return (
        <div className="rounded-lg bg-destructive/10 p-4 text-[#ef4444]">
            <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="grid gap-1">
                    <div className="font-medium">Transcription failed</div>
                    <div className="font-mono text-sm">{error}</div>
                    {error.includes('API key') && (
                        <div className="font-mono text-sm">
                            You can find your API key at https://platform.openai.com/account/api-keys.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
