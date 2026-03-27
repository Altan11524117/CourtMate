import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/utils'

const schema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })
type FormData = z.infer<typeof schema>

const field = (error?: boolean): React.CSSProperties => ({
    padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: `1.5px solid ${error ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
    color: 'white', outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
})

const Register: React.FC = () => {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        setError('')
        try {
            await authApi.register({ fullName: data.fullName, email: data.email, password: data.password })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2200)
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)',
        }}>
            {/* Left panel */}
            <div style={{
                display: 'none', flex: '1',
                background: 'linear-gradient(145deg, #0f1f0f 0%, #1a3d2b 50%, #0f2a1a 100%)',
                padding: '48px', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }} className="auth-panel">
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />
                <div style={{
                    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)',
                    bottom: '10%', right: '-10%', pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M4.5 9 Q12 4 19.5 9" /><path d="M4.5 15 Q12 20 19.5 15" />
                            <line x1="12" y1="2" x2="12" y2="22" />
                        </svg>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: 'white' }}>
                        Court<span style={{ color: '#c9a96e' }}>Mate</span>
                    </span>
                </div>

                <div style={{ position: 'relative' }}>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 500 }}>
                        Join the community
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 52px)',
                        color: 'white', lineHeight: 1.15, marginBottom: '24px', fontWeight: 700,
                    }}>
                        Start playing<br />
                        <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>at your level.</span>
                    </h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '360px' }}>
                        Take our AI placement exam after signing up to get matched with players at your exact level.
                    </p>
                </div>

                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '320px' }}>
                    {[
                        { icon: '🎯', text: 'AI Level Exam' },
                        { icon: '📍', text: 'Location Based' },
                        { icon: '🤝', text: 'Find Partners' },
                        { icon: '🏆', text: 'Track Matches' },
                    ].map(item => (
                        <div key={item.text} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 14px', borderRadius: '10px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <span style={{ fontSize: '16px' }}>{item.icon}</span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form panel */}
            <div style={{
                width: '100%', maxWidth: '480px', margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px 32px',
            }} className="auth-form-panel">
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }} className="auth-mobile-logo">
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M4.5 9 Q12 4 19.5 9" /><path d="M4.5 15 Q12 20 19.5 15" />
                                <line x1="12" y1="2" x2="12" y2="22" />
                            </svg>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'white' }}>
                            Court<span style={{ color: '#c9a96e' }}>Mate</span>
                        </span>
                    </div>

                    {success ? (
                        <div style={{
                            textAlign: 'center', padding: '48px 24px',
                            backgroundColor: 'rgba(64,145,108,0.1)', borderRadius: '16px',
                            border: '1px solid rgba(64,145,108,0.2)',
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', marginBottom: '8px' }}>
                                Account created!
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Redirecting to sign in...</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'white', marginBottom: '6px', fontWeight: 700 }}>
                                Create an account
                            </h2>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '36px' }}>
                                Free forever. No credit card required.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {/* Full name */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Full Name</label>
                                    <input type="text" placeholder="John Doe" {...register('fullName')}
                                        style={field(!!errors.fullName)}
                                        onFocus={e => e.currentTarget.style.borderColor = errors.fullName ? '#f87171' : 'rgba(64,145,108,0.7)'}
                                        onBlur={e => e.currentTarget.style.borderColor = errors.fullName ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                    />
                                    {errors.fullName && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.fullName.message}</p>}
                                </div>

                                {/* Email */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Email</label>
                                    <input type="email" placeholder="you@example.com" {...register('email')}
                                        style={field(!!errors.email)}
                                        onFocus={e => e.currentTarget.style.borderColor = errors.email ? '#f87171' : 'rgba(64,145,108,0.7)'}
                                        onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                    />
                                    {errors.email && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.email.message}</p>}
                                </div>

                                {/* Password */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" {...register('password')}
                                            style={{ ...field(!!errors.password), paddingRight: '44px' }}
                                            onFocus={e => e.currentTarget.style.borderColor = errors.password ? '#f87171' : 'rgba(64,145,108,0.7)'}
                                            onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0, display: 'flex',
                                        }}>
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.password && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.password.message}</p>}
                                </div>

                                {/* Confirm */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Confirm Password</label>
                                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...register('confirm')}
                                        style={field(!!errors.confirm)}
                                        onFocus={e => e.currentTarget.style.borderColor = errors.confirm ? '#f87171' : 'rgba(64,145,108,0.7)'}
                                        onBlur={e => e.currentTarget.style.borderColor = errors.confirm ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                    />
                                    {errors.confirm && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.confirm.message}</p>}
                                </div>

                                {error && (
                                    <div style={{
                                        padding: '12px 16px', borderRadius: '10px',
                                        backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                                        color: '#fca5a5', fontSize: '13px',
                                    }}>{error}</div>
                                )}

                                <button type="submit" disabled={isSubmitting} style={{
                                    marginTop: '8px', padding: '13px', borderRadius: '10px', fontSize: '15px',
                                    fontFamily: 'var(--font-body)', fontWeight: 600,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    border: 'none', opacity: isSubmitting ? 0.7 : 1,
                                    background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                                    color: 'white', width: '100%', transition: 'opacity 0.2s',
                                }}>
                                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                                </button>
                            </form>

                            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '28px' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#40916c', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Register