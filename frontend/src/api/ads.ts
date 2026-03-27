import api from './axios'
import type { Ad, AdDetail, AdInput, Application } from '@/types'

export const adsApi = {
    list: async (params?: {
        limit?: number
        offset?: number
    }): Promise<Ad[]> => {
        const res = await api.get('/ads', { params })
        return res.data
    },

    search: async (params?: {
        category?: string
        location?: string
        sort?: 'newest' | 'oldest' | 'level_asc' | 'level_desc'
    }): Promise<Ad[]> => {
        const res = await api.get('/ads/search', { params })
        return res.data
    },

    create: async (data: AdInput): Promise<Ad> => {
        const res = await api.post('/ads', data)
        return res.data
    },

    getDetail: async (adId: string): Promise<AdDetail> => {
        const res = await api.get(`/ads/${adId}`)
        return res.data
    },

    update: async (adId: string, data: AdInput): Promise<Ad> => {
        const res = await api.patch(`/ads/${adId}`, data)
        return res.data
    },

    delete: async (adId: string): Promise<void> => {
        await api.delete(`/ads/${adId}`)
    },

    // Applications
    listApplications: async (adId: string): Promise<Application[]> => {
        const res = await api.get(`/ads/${adId}/applications`)
        return res.data
    },

    apply: async (adId: string): Promise<void> => {
        await api.post(`/ads/${adId}/applications`)
    },

    updateApplicationStatus: async (
        adId: string,
        applicationId: string,
        status: 'approved' | 'rejected'
    ): Promise<void> => {
        await api.patch(`/ads/${adId}/applications/${applicationId}`, { status })
    },
}