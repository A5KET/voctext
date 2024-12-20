import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
    return format(date, 'EEE MMM dd yyyy HH:mm:ss')
}

export function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60)
    const seconds = (duration % 60).toFixed(1)

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
}
