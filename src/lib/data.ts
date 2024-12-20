'use server'

import { PrismaClient, Prisma } from '@prisma/client'
import { Transcription, TranscriptionRequest } from './definitions'

const prisma = new PrismaClient()

export async function fetchTranscriptions(userId: string) {
    return prisma.transcription.findMany({
        where: {
            userId,
        },
    })
}

export async function createTranscription(transcription: Prisma.TranscriptionCreateInput) {
    return prisma.transcription.create({
        data: transcription,
    })
}

export async function createTranscriptionRequest(transcriptionRequest: Prisma.TranscriptionRequestCreateInput) {
    return prisma.transcriptionRequest.create({
        data: transcriptionRequest,
    })
}

export async function confirmTranscriptionRequest(
    transcriptionRequest: TranscriptionRequest,
    transcription: Transcription,
    fileName: string
) {
    console.log('confirm')
    return prisma.transcriptionRequest.update({
        where: {
            id: transcriptionRequest.id,
        },
        data: {
            fileName,
            status: 'COMPLETED',
            transcriptionId: transcription.id,
        },
    })
}

export async function setTranscriptionRequestError(transcriptionRequest: TranscriptionRequest, error: string) {
    console.log(error)
    return prisma.transcriptionRequest.update({
        where: {
            id: transcriptionRequest.id,
        },
        data: {
            error,
        },
    })
}

export async function updateTranscriptionTitle(transcription: Prisma.TranscriptionUpdateInput, newTitle: string) {
    return prisma.transcription.update({
        where: {
            id: transcription.id?.toString(),
        },
        data: {
            title: newTitle,
        },
    })
}

export async function deleteTranscription(transcription: Transcription) {
    return prisma.transcription.delete({
        where: {
            id: transcription.id,
        },
    })
}

export async function createPayment(payment: Prisma.PaymentCreateInput) {
    return prisma.payment.create({
        data: payment,
    })
}

export async function fetchUserTranscriptionCounter(userId: string) {
    return prisma.transcription.count({
        where: {
            userId,
        },
    })
}

export async function checkIsUserSupporter(userId: string) {
    return Boolean(await prisma.payment.findFirst({
        where: {
            userId
        }
    }))
}
