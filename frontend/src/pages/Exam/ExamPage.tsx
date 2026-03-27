import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { examsApi } from '@/api/exams'
import { usersApi } from '@/api/users'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/Navbar'
import type { ExamQuestion } from '@/types'

const ExamPage: React.FC = () => {
    const navigate = useNavigate()
    const { user, setUser } = useAuthStore()

    const [started, setStarted] = useState(false)
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const { data: questions = [], isLoading } = useQuery({
        queryKey: ['exam-questions'],
        queryFn: examsApi.getQuestions,
        enabled: started,
    })

    const currentQ: ExamQuestion | undefined = questions[current]
    const progress = questions.length > 0 ? (current / questions.length) * 100 : 0
    const isAnswered = currentQ ? !!answers[currentQ.id] : false
    const isLast = current === questions.length - 1
    const answered = Object.keys(answers).length

    const handleAnswer = (qId: string, optId: string) =>
        setAnswers(prev => ({ ...prev, [qId]: optId }))

    const handleSubmit = async () => {
        setSubmitting(true)
        setError('')
        try {
            const payload = Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }))
            const result = await examsApi.submitExam(payload)
            if (user) {
                const updated = await usersApi.getProfile(user.id)
                setUser(updated)
            }
            navigate('/exam/result', { state: { result, questions, answers } })
        } catch {
            setError('Could not submit exam. Please try again.')
            setSubmitting(false)
        }
    }

    // ── Intro ─────────────────────────────────────────────────────────────────
    if (!started) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
                <Navbar />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>

                    {/* Hero card */}
                    <div style={{
                        borderRadius: '24px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.08)',
                        animation: 'fadeUp 0.5s ease forwards',
                    }}>
                        {/* Dark green top section */}
                        <div style={{
                            background: 'linear-gradient(145deg, #0f1f0f, #1a3d2b)',
                            padding: '48px 40px 40px',
                            position: 'relative', overflow: 'hidden',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0, pointerEvents: 'none',
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                            }} />
                            <div style={{
                                position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)',
                                top: '-80px', right: '-60px', pointerEvents: 'none',
                            }} />

                            {/* Icon */}
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '24px', position: 'relative',
                            }}>
                                <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                                </svg>
                            </div>

                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 500 }}>
                                AI-Powered
                            </p>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'white', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
                                Level Placement<br />
                                <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Exam</span>
                            </h1>
                        </div>

                        {/* Bottom section */}
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '36px 40px' }}>

                            {/* Feature grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
                                {[
                                    { icon: '🎯', label: 'Dynamic', sub: 'Adapts to your level' },
                                    { icon: '⏱️', label: 'No time limit', sub: 'Take your time' },
                                    { icon: '🏅', label: 'ITN Rating', sub: 'Instant result' },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        padding: '16px 12px', borderRadius: '12px', textAlign: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                    }}>
                                        <div style={{ fontSize: '22px', marginBottom: '8px' }}>{item.icon}</div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginBottom: '3px' }}>{item.label}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{item.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Current level warning */}
                            {user?.level && (
                                <div style={{
                                    padding: '14px 16px', borderRadius: '12px', marginBottom: '24px',
                                    backgroundColor: 'rgba(201,169,110,0.08)',
                                    border: '1px solid rgba(201,169,110,0.2)',
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                }}>
                                    <span style={{ fontSize: '20px' }}>⚠️</span>
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#e4c07a', margin: '0 0 2px' }}>
                                            Current level: {user.level}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                                            Retaking this exam will update your level.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setStarted(true)} style={{
                                width: '100%', padding: '15px', borderRadius: '12px',
                                fontSize: '15px', fontWeight: 700, cursor: 'pointer', border: 'none',
                                background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                                color: 'white', transition: 'opacity 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                Start Exam →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
                <Navbar />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px' }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    backgroundColor: '#40916c',
                                    animation: 'pulseDot 1.5s ease-in-out infinite',
                                    animationDelay: `${i * 0.2}s`,
                                }} />
                            ))}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Loading questions...</p>
                    </div>
                </div>
            </div>
        )
    }

    // ── No questions ──────────────────────────────────────────────────────────
    if (questions.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '20px' }}>
                        No questions found. Please try again later.
                    </p>
                    <button onClick={() => navigate('/ads')} style={{
                        padding: '11px 24px', borderRadius: '10px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)',
                    }}>Back to Listings</button>
                </div>
            </div>
        )
    }

    // ── Exam ──────────────────────────────────────────────────────────────────
    const letters = ['A', 'B', 'C', 'D']

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar />

            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 60px' }}>

                {/* Progress header */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                            Question {current + 1} of {questions.length}
                        </span>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                            {answered} answered
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: '99px',
                            background: 'linear-gradient(90deg, #1a3d2b, #40916c)',
                            width: `${progress}%`, transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>

                {/* Question card */}
                {currentQ && (
                    <div key={currentQ.id} style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px', overflow: 'hidden',
                        animation: 'fadeUp 0.35s ease forwards',
                    }}>
                        {/* Question header */}
                        <div style={{
                            padding: '28px 28px 24px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            background: 'rgba(255,255,255,0.01)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <span style={{
                                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '99px',
                                    ...(currentQ.difficultyLevel === 'hard'
                                        ? { backgroundColor: 'rgba(248,113,113,0.12)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' }
                                        : currentQ.difficultyLevel === 'medium'
                                            ? { backgroundColor: 'rgba(201,169,110,0.15)', color: '#e4c07a', border: '1px solid rgba(201,169,110,0.25)' }
                                            : { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.2)' }
                                    ),
                                }}>
                                    {currentQ.difficultyLevel === 'hard' ? 'Hard' : currentQ.difficultyLevel === 'medium' ? 'Medium' : 'Easy'}
                                </span>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
                                    {currentQ.pointValue} pts
                                </span>
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-display)', fontSize: '20px',
                                color: 'white', fontWeight: 600, lineHeight: 1.4, margin: 0,
                            }}>
                                {currentQ.text}
                            </h2>
                        </div>

                        {/* Options */}
                        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {currentQ.options.map((opt, idx) => {
                                const selected = answers[currentQ.id] === opt.id
                                return (
                                    <button key={opt.id} onClick={() => handleAnswer(currentQ.id, opt.id)} style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        padding: '14px 18px', borderRadius: '12px', textAlign: 'left',
                                        cursor: 'pointer', transition: 'all 0.18s', width: '100%',
                                        border: `1.5px solid ${selected ? 'rgba(64,145,108,0.6)' : 'rgba(255,255,255,0.07)'}`,
                                        backgroundColor: selected ? 'rgba(64,145,108,0.1)' : 'rgba(255,255,255,0.02)',
                                    }}
                                        onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' } }}
                                        onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)' } }}
                                    >
                                        <span style={{
                                            width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '12px', fontWeight: 700, transition: 'all 0.18s',
                                            backgroundColor: selected ? '#40916c' : 'rgba(255,255,255,0.06)',
                                            color: selected ? 'white' : 'rgba(255,255,255,0.35)',
                                            border: `1px solid ${selected ? '#40916c' : 'rgba(255,255,255,0.1)'}`,
                                        }}>
                                            {letters[idx]}
                                        </span>
                                        <span style={{
                                            fontSize: '14px', lineHeight: 1.45,
                                            color: selected ? 'white' : 'rgba(255,255,255,0.65)',
                                            fontWeight: selected ? 500 : 400,
                                            transition: 'color 0.18s', flex: 1,
                                        }}>
                                            {opt.text}
                                        </span>
                                        {selected && (
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="#6fcfa0" style={{ flexShrink: 0 }}>
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Navigation */}
                        <div style={{
                            padding: '20px 28px',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                        }}>
                            <button onClick={() => setCurrent(p => p - 1)} disabled={current === 0} style={{
                                padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                                fontWeight: 500, cursor: current === 0 ? 'not-allowed' : 'pointer',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: 'transparent',
                                color: current === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                                transition: 'all 0.18s',
                            }}>
                                ← Prev
                            </button>

                            {/* Dot indicators */}
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
                                {questions.map((q, i) => (
                                    <button key={i} onClick={() => setCurrent(i)} style={{
                                        width: i === current ? '20px' : '7px',
                                        height: '7px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                                        transition: 'all 0.25s',
                                        backgroundColor: i === current
                                            ? '#40916c'
                                            : answers[q.id]
                                                ? 'rgba(64,145,108,0.4)'
                                                : 'rgba(255,255,255,0.12)',
                                        padding: 0,
                                    }} />
                                ))}
                            </div>

                            {isLast ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || answered < questions.length}
                                    style={{
                                        padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                                        fontWeight: 700, cursor: answered < questions.length ? 'not-allowed' : 'pointer',
                                        border: 'none', transition: 'all 0.18s',
                                        backgroundColor: answered < questions.length ? 'rgba(255,255,255,0.06)' : '#c9a96e',
                                        color: answered < questions.length ? 'rgba(255,255,255,0.25)' : '#0a0f0a',
                                        opacity: submitting ? 0.6 : 1,
                                    }}
                                >
                                    {submitting ? 'Submitting...' : 'Finish 🎾'}
                                </button>
                            ) : (
                                <button onClick={() => setCurrent(p => p + 1)} disabled={!isAnswered} style={{
                                    padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                                    fontWeight: 600, cursor: !isAnswered ? 'not-allowed' : 'pointer',
                                    border: 'none', transition: 'all 0.18s',
                                    backgroundColor: !isAnswered ? 'rgba(255,255,255,0.06)' : '#40916c',
                                    color: !isAnswered ? 'rgba(255,255,255,0.25)' : 'white',
                                }}>
                                    Next →
                                </button>
                            )}
                        </div>

                        {error && (
                            <div style={{
                                margin: '0 28px 20px', padding: '12px 16px', borderRadius: '10px',
                                backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                                color: '#fca5a5', fontSize: '13px',
                            }}>{error}</div>
                        )}
                    </div>
                )}

                {/* Bottom hint */}
                {!isLast && answered < questions.length && (
                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '16px' }}>
                        Answer all questions to finish the exam
                    </p>
                )}
            </div>
        </div>
    )
}

export default ExamPage