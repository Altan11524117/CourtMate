import api from './axios'
import type { ExamQuestion, ExamResult } from '@/types'

export const examsApi = {
    getQuestions: async (): Promise<ExamQuestion[]> => {
        const res = await api.get('/exams/placement/questions')
        return res.data
    },

    submitExam: async (answers: {
        questionId: string
        optionId: string
    }[]): Promise<ExamResult> => {
        const res = await api.post('/exams/placement/submit', { answers })
        return res.data
    },

    analyzeExam: async (answers: {
        questionText: string
        selectedText: string
        isCorrect: boolean
    }[]): Promise<{ analysis: string }> => {
        const res = await api.post('/exams/analyze', { answers })
        return res.data
    },
}