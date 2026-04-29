import api from './axios'
import type { User } from '@/types'

export const usersApi = {
    getMe: async (): Promise<{ userID: string }> => {
        const res = await api.get('/users/me')
        return res.data
    },

    getProfile: async (userId: string): Promise<User> => {
        const res = await api.get(`/users/${userId}/profile`)
        return res.data
    },

    updateProfile: async (
        userId: string,
        data: {
            fullName?: string
            preferredHand?: string
            bio?: string
        }
    ): Promise<User> => {
        const res = await api.patch(`/users/${userId}/profile`, data)
        return res.data
    },

    deleteUser: async (userId: string): Promise<void> => {
        await api.delete(`/users/${userId}`)
    },
}