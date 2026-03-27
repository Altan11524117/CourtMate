import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth'
import { usersApi } from '@/api/users'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage } from '@/utils'

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

const Login: React.FC = () => {
    const navigate = useNavigate()
    const { setToken, setUser } = useAuthStore()
    const [error, setError] = useState('')
    const [showPass, setShowPass] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        setError('')
        try {
            const res = await authApi.login(data)
            setToken(res.token)
            const me = await usersApi.getMe()
            const profile = await usersApi.getProfile(me.userID)
            setUser(profile)
            navigate('/ads')
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#0a0f0a',
            fontFamily: 'var(--font-body)',
        }}>
            {/* Left decorative panel */}
            <div style={{
                display: 'none',
                flex: '1',
                background: 'linear-gradient(145deg, #0f1f0f 0%, #1a3d2b 50%, #0f2a1a 100%)',
                padding: '48px',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
            }} className="auth-panel">

                {/* Grid lines decoration */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }} />

                {/* Glow orb */}
                <div style={{
                    position: 'absolute',
                    width: '400px', height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(64,145,108,0.15) 0%, transparent 70%)',
                    top: '20%', left: '10%',
                    pointerEvents: 'none',
                }} />

                {/* Logo */}
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

                {/* Hero text */}
                <div style={{ position: 'relative' }}>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 500 }}>
                        Tennis Partner Network
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(36px, 4vw, 52px)',
                        color: 'white',
                        lineHeight: 1.15,
                        marginBottom: '24px',
                        fontWeight: 700,
                    }}>
                        Find your perfect<br />
                        <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>court partner.</span>
                    </h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '360px' }}>
                        AI-powered level matching. Real players, real courts, real matches.
                    </p>
                </div>

                {/* Level badges */}
                <div style={{ position: 'relative', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['Beginner · ITN 10', 'Intermediate · ITN 7', 'Advanced · ITN 3'].map((l) => (
                        <span key={l} style={{
                            padding: '6px 14px', borderRadius: '99px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: '12px', fontWeight: 500,
                        }}>{l}</span>
                    ))}
                </div>
            </div>

            {/* Right form panel */}
            <div style={{
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 32px',
            }} className="auth-form-panel">
                <div style={{ width: '100%' }}>

                    {/* Mobile logo */}
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

                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'white', marginBottom: '6px', fontWeight: 700 }}>
                        Welcome back
                    </h2>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '36px' }}>
                        Sign in to your account to continue
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                style={{
                                    padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                    border: `1.5px solid ${errors.email ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                    color: 'white', outline: 'none', width: '100%', boxSizing: 'border-box',
                                    fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = errors.email ? '#f87171' : 'rgba(64,145,108,0.7)'}
                                onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#f87171' : 'rgba(255,255,255,0.1)'}
                            />
                            {errors.email && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Password</label>
                                <Link to="/reset-password" style={{ fontSize: '12px', color: '#40916c', textDecoration: 'none' }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    style={{
                                        padding: '12px 44px 12px 16px', borderRadius: '10px', fontSize: '14px',
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        border: `1.5px solid ${errors.password ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                        color: 'white', outline: 'none', width: '100%', boxSizing: 'border-box',
                                        fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = errors.password ? '#f87171' : 'rgba(64,145,108,0.7)'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
                                    padding: 0, display: 'flex',
                                }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPass
                                            ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></>
                                            : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                                        }
                                    </svg>
                                </button>
                            </div>
                            {errors.password && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.password.message}</p>}
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px 16px', borderRadius: '10px',
                                backgroundColor: 'rgba(248,113,113,0.1)',
                                border: '1px solid rgba(248,113,113,0.3)',
                                color: '#fca5a5', fontSize: '13px',
                            }}>{error}</div>
                        )}

                        <button type="submit" disabled={isSubmitting} style={{
                            marginTop: '8px', padding: '13px', borderRadius: '10px', fontSize: '15px',
                            fontFamily: 'var(--font-body)', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            border: 'none', opacity: isSubmitting ? 0.7 : 1,
                            background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                            color: 'white', transition: 'opacity 0.2s, transform 0.1s',
                            width: '100%',
                        }}
                            onMouseEnter={e => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
                            onMouseLeave={e => !isSubmitting && (e.currentTarget.style.opacity = '1')}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '28px' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#40916c', textDecoration: 'none', fontWeight: 600 }}>
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login