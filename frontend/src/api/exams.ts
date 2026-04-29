import api from './axios'
import type { ExamQuestion, ExamResult } from '@/types'

export const examsApi = {
    getQuestions: async (userLevel?: string): Promise<ExamQuestion[]> => {
        const res = await api.get('/exams/placement/questions')
        const data = res.data?.payload !== undefined ? res.data.payload : res.data
        let questions = Array.isArray(data) ? data : []

        if (questions.length === 0) {
            let difficulty = 'easy'
            if (userLevel?.includes('Intermediate')) difficulty = 'medium'
            if (userLevel?.includes('Advanced')) difficulty = 'hard'

            try {
                const genRes = await api.post('/exams/questions/generate', { difficultyLevel: difficulty, count: 5 })
                const genData = genRes.data?.questions !== undefined ? genRes.data.questions : genRes.data
                questions = Array.isArray(genData) ? genData : []
            } catch (err) {
                console.error("Failed to generate questions", err)
            }
        }

        return questions
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