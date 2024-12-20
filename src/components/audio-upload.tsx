'use client'

import { useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'

export interface FileDropzoneProps {
    onFileUploadAction: (file: File) => void
}

export default function AudioUpload({ onFileUploadAction }: FileDropzoneProps) {
    const onDrop = useCallback(
        <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                const errorMessage = fileRejections
                    .map(({ errors }) => errors.map((e) => e.message).join(', '))
                    .join('; ')
                console.error(errorMessage)

                return
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]

                onFileUploadAction(file)
            }
        },
        [onFileUploadAction]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/mpeg': ['.mp3'],
            'audio/wav': ['.wav'],
            'audio/mp4': ['.m4a'],
        },
        maxSize: 25 * 1024 * 1024, // 25MB
        multiple: false,
    })

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors space-y-3 hover:border-primary
                    ${isDragActive ? 'border-primary bg-primary/5' : ''}`}
            >
                <input {...getInputProps()} />
                <p className="text-muted-foreground">Drag and drop an audio file here, or click to select</p>
                <p className="text-muted-foreground">Supported formats: MP3, WAV, M4A (max 25MB)</p>
            </div>
        </div>
    )
}
