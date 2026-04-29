import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { examsApi } from '@/api/exams'
import { Navbar } from '@/components/Navbar'
import type { ExamResult, ExamQuestion } from '@/types'

interface LocationState {
    result: ExamResult
    questions: ExamQuestion[]
    answers: Record<string, string>
}

const levelEmoji: Record<string, string> = {
    'Advanced (ITN 3)': '🏆',
    'Upper-Intermediate (ITN 5)': '🥇',
    'Intermediate (ITN 7)': '🎾',
    'Beginner (ITN 10)': '🌱',
}

const levelStyle = (l: string | undefined | null): React.CSSProperties => {
    if (l == null || l === '') {
        return { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }
    }
    if (l.includes('Advanced')) return { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.25)' }
    if (l.includes('Upper-Intermediate')) return { backgroundColor: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }
    if (l.includes('Intermediate')) return { backgroundColor: 'rgba(201,169,110,0.15)', color: '#e4c07a', border: '1px solid rgba(201,169,110,0.25)' }
    return { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }
}

const ExamResultPage: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state as LocationState | null

    const [analysis, setAnalysis] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisError, setAnalysisError] = useState('')

    useEffect(() => {
        if (!state) return
        fetchAnalysis()
    }, [])

    const fetchAnalysis = async () => {
        if (!state) return
        setAnalyzing(true)
        try {
            const { questions, answers } = state
<<<<<<< Updated upstream
            const list = questions ?? []
            const payload = list.map(q => ({
                questionText: q.text ?? '',
=======
            const payload = questions.map(q => ({
                questionText: q.text,
>>>>>>> Stashed changes
                selectedText: (q.options ?? []).find(o => o.id === answers[q.id])?.text ?? '',
                isCorrect: false,
            }))
            const res = await examsApi.analyzeExam(payload)
            setAnalysis(res.analysis)
        } catch {
            setAnalysisError('AI analysis could not be retrieved.')
        } finally {
            setAnalyzing(false)
        }
    }

    if (!state) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '20px' }}>No result found.</p>
                    <button onClick={() => navigate('/exam')} style={{
                        padding: '11px 24px', borderRadius: '10px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer', border: 'none',
                        backgroundColor: '#40916c', color: 'white',
                    }}>Go to Exam</button>
                </div>
            </div>
        )
    }

    const { result } = state
    const emoji = levelEmoji[result.assignedLevel] ?? '🎾'

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar />

            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 60px' }}>

                {/* Result hero */}
                <div style={{
                    borderRadius: '24px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '16px',
                    animation: 'fadeUp 0.5s ease forwards',
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #0f1f0f, #1a3d2b)',
                        padding: '48px 40px',
                        textAlign: 'center',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px', pointerEvents: 'none',
                        }} />
                        <div style={{
                            position: 'absolute', width: '350px', height: '350px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(64,145,108,0.15) 0%, transparent 65%)',
                            top: '-80px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
                        }} />

                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '56px', marginBottom: '20px' }}>{emoji}</div>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 500 }}>
                                Your Level
                            </p>
                            <h1 style={{
                                fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 34px)',
                                color: 'white', fontWeight: 700, marginBottom: '20px', lineHeight: 1.2,
                            }}>
                                {result.assignedLevel}
                            </h1>
                            <span style={{
                                display: 'inline-block', fontSize: '13px', fontWeight: 600,
                                padding: '6px 20px', borderRadius: '99px',
                                ...levelStyle(result.assignedLevel),
                            }}>
                                Total Score: {result.totalScore.toFixed(0)} pts
                            </span>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        {[
                            { label: 'Questions', value: state.questions.length },
                            { label: 'Answered', value: Object.keys(state.answers).length },
                            { label: 'Score', value: result.totalScore.toFixed(0) },
                        ].map((item, i) => (
                            <div key={item.label} style={{
                                padding: '24px 16px', textAlign: 'center',
                                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#6fcfa0', fontWeight: 700, marginBottom: '4px' }}>
                                    {item.value}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Analysis */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', overflow: 'hidden',
                    marginBottom: '16px',
                    animation: 'fadeUp 0.5s ease forwards',
                    animationDelay: '120ms',
                }}>
                    <div style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                            background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            </svg>
                        </div>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'white', margin: 0 }}>
                                AI Coach Analysis
                            </h3>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', margin: '2px 0 0' }}>
                                Powered by Groq / LLaMA 3.3
                            </p>
                        </div>
                    </div>

                    <div style={{ padding: '24px' }}>
                        {analyzing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{
                                            width: '7px', height: '7px', borderRadius: '50%',
                                            backgroundColor: '#40916c',
                                            animation: 'pulseDot 1.5s ease-in-out infinite',
                                            animationDelay: `${i * 0.2}s`,
                                        }} />
                                    ))}
                                </div>
                                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                                    Preparing your analysis...
                                </span>
                            </div>
                        ) : analysisError ? (
                            <p style={{ color: '#fca5a5', fontSize: '13px', margin: 0 }}>{analysisError}</p>
                        ) : (
                            <p style={{
                                fontSize: '14px', color: 'rgba(255,255,255,0.65)',
                                lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line',
                            }}>
                                {analysis}
                            </p>
                        )}
                    </div>
                </div>

                {/* CTAs */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
                    animation: 'fadeUp 0.5s ease forwards', animationDelay: '200ms',
                }}>
                    <button onClick={() => navigate('/ads')} style={{
                        padding: '14px', borderRadius: '12px', fontSize: '14px',
                        fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                        color: 'white', transition: 'opacity 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        🎾 Browse Listings
                    </button>
                    <button onClick={() => navigate('/exam')} style={{
                        padding: '14px', borderRadius: '12px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)',
                        transition: 'all 0.18s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                    >
                        Retake Exam
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExamResultPage