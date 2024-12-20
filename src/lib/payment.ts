'use client'

import axios from 'axios'

export async function fetchPaymentSession(amount: number) {
    return axios.post<{ amount: number }, { data: { sessionId: string } }>('/api/payment', { amount })
}
