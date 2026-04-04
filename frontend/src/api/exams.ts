import api from './axios'
import type { ExamQuestion, ExamResult } from '@/types'

export const examsApi = {
    getQuestions: async (): Promise<ExamQuestion[]> => {
        const res = await api.get('/exams/placement/questions')
        const data = res.data?.payload !== undefined ? res.data.payload : res.data
        return Array.isArray(data) ? data : []
    },

    submitExam: async (answers: {
        questionId: string
        optionId: string
    }[]): Promise<ExamResult> => {
        const res = await api.post('/exams/placement/submit', { answers })
        return res.data?.payload !== undefined ? res.data.payload : res.data
    },

    analyzeExam: async (answers: {
        questionText: string
        selectedText: string
        isCorrect: boolean
    }[]): Promise<{ analysis: string }> => {
        const res = await api.post('/exams/analyze', { answers })
        return res.data?.payload !== undefined ? res.data.payload : res.data
    },
}