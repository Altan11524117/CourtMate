export interface User {
    id: string
    fullName: string
    email: string
    level: string
    isActive: boolean
    preferredHand?: string
    bio?: string
    createdAt?: string
}

export interface Ad {
    id: string
    ownerId: string
    title: string
    category: string
    location: string
    requiredLevel: string
    matchDate: string
    status: 'open' | 'filled' | 'cancelled'
    viewCount?: number
    createdAt?: string
}

export interface AdDetail extends Ad {
    viewCount: number
    ownerProfileSummary: {
        fullName: string
        level: string
    }
}

export interface AdInput {
    title: string
    category: string
    location: string
    requiredLevel: string
    matchDate: string
}

export interface Application {
    id: string
    applicantId: string
    applicantName: string
    applicantLevel: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
}

export interface ExamQuestion {
    id: string
    text: string
    difficultyLevel: string
    orderIndex: number
    pointValue: number
    options: ExamOption[]
}

export interface ExamOption {
    id: string
    text: string
}

export interface ExamResult {
    assignedLevel: string
    totalScore: number
    resultId: string
}

export interface TokenResponse {
    token: string
    expiresIn: number
}