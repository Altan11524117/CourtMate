import api from './axios'
import type { TokenResponse, User } from '@/types'

export const authApi = {
    register: async (data: {
        fullName: string
        email: string
        password: string
    }): Promise<User> => {
        const res = await api.post('/auth/register', data)
        return res.data
    },

    login: async (data: {
        email: string
        password: string
    }): Promise<TokenResponse> => {
        const res = await api.post('/auth/login', data)
        return res.data
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout')
    },

    resetPassword: async (email: string): Promise<void> => {
        await api.post('/auth/reset-password', { email })
    },

    confirmResetPassword: async (data: {
        token: string
        newPassword: string
    }): Promise<void> => {
        await api.post('/auth/reset-password/confirm', data)
    },
}