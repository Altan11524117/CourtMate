import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/utils'
import { InteractiveCourtGrid } from '@/components/InteractiveCourtGrid'
import { AuthPageLayout } from '@/components/AuthPageLayout'

const requestSchema = z.object({
    email: z.string().email('Lütfen geçerli bir e-posta girin'),
})
const confirmSchema = z.object({
    newPassword: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    confirm: z.string(),
}).refine((d) => d.newPassword === d.confirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirm'],
})

type RequestData = z.infer<typeof requestSchema>
type ConfirmData = z.infer<typeof confirmSchema>

const fieldStyle = (error?: boolean): React.CSSProperties => ({
    padding: '13px 16px', borderRadius: '12px', fontSize: '15px',
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: `1.5px solid ${error ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
    color: 'white', outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)', transition: 'border-color 0.2s, box-shadow 0.2s',
    minHeight: '48px',
})

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [sent, setSent] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')
    const [showPass, setShowPass] = useState(false)

    const requestForm = useForm<RequestData>({ resolver: zodResolver(requestSchema) })
    const confirmForm = useForm<ConfirmData>({ resolver: zodResolver(confirmSchema) })

    const onRequest = async (data: RequestData) => {
        setError('')
        try {
            await authApi.resetPassword(data.email)
            setSent(true)
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    const onConfirm = async (data: ConfirmData) => {
        setError('')
        try {
            await authApi.confirmResetPassword({ token: token!, newPassword: data.newPassword })
            setDone(true)
            setTimeout(() => navigate('/login'), 2200)
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    return (
        <AuthPageLayout>
            <InteractiveCourtGrid
                className="auth-panel"
                style={{
                    display: 'none',
                    flex: '1',
                    background: 'linear-gradient(145deg, #0f1f0f 0%, #1a3d2b 50%, #0f2a1a 100%)',
                    padding: '48px 48px clamp(40px, 6vh, 72px) 48px',
                }}
                innerStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1,
                    minHeight: 0,
                }}
            >
                <div style={{
                    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(64,145,108,0.15) 0%, transparent 70%)',
                    top: '20%', left: '10%', pointerEvents: 'none',
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
                        Account Recovery
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 52px)',
                        color: 'white', lineHeight: 1.15, marginBottom: '24px', fontWeight: 700,
                    }}>
                        Get back on<br />
                        <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>the court.</span>
                    </h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '360px' }}>
                        Reset your password to securely access your tennis profile and upcoming matches.
                    </p>
                </div>

                <div style={{ position: 'relative', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                        padding: '6px 14px', borderRadius: '99px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '12px', fontWeight: 500,
                    }}>Secure Recovery</span>
                </div>
            </InteractiveCourtGrid>

            <div className="auth-form-column">
                <div className="auth-form-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }} className="auth-mobile-logo">
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

                    <div className="auth-form-eyebrow" />

                    {token ? (
                        done ? (
                            <div style={{
                                textAlign: 'center', padding: '32px 16px',
                                backgroundColor: 'rgba(64,145,108,0.08)', borderRadius: '16px',
                                border: '1px solid rgba(64,145,108,0.22)',
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', marginBottom: '8px' }}>
                                    Şifre güncellendi!
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>Giriş sayfasına yönlendiriliyorsunuz...</p>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 28px)', color: 'white', marginBottom: '8px', fontWeight: 700, lineHeight: 1.2 }}>
                                    Yeni şifre belirle
                                </h2>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', lineHeight: 1.5 }}>
                                    Yeni şifreni gir ve hesabına geri dön.
                                </p>

                                <form onSubmit={confirmForm.handleSubmit(onConfirm)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.72)' }}>Yeni Şifre</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                {...confirmForm.register('newPassword')}
                                                className="auth-field-input"
                                                style={{ ...fieldStyle(!!confirmForm.formState.errors.newPassword), paddingRight: '48px' }}
                                                onFocus={e => { e.currentTarget.style.borderColor = confirmForm.formState.errors.newPassword ? '#f87171' : 'rgba(64,145,108,0.75)' }}
                                                onBlur={e => { e.currentTarget.style.borderColor = confirmForm.formState.errors.newPassword ? '#f87171' : 'rgba(255,255,255,0.12)' }}
                                            />
                                            <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '6px', display: 'flex', borderRadius: '8px',
                                            }} aria-label={showPass ? 'Gizle' : 'Göster'}>
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {showPass
                                                        ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></>
                                                        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                                                    }
                                                </svg>
                                            </button>
                                        </div>
                                        {confirmForm.formState.errors.newPassword && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{confirmForm.formState.errors.newPassword.message}</p>}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.72)' }}>Şifre Tekrar</label>
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            {...confirmForm.register('confirm')}
                                            className="auth-field-input"
                                            style={fieldStyle(!!confirmForm.formState.errors.confirm)}
                                            onFocus={e => { e.currentTarget.style.borderColor = confirmForm.formState.errors.confirm ? '#f87171' : 'rgba(64,145,108,0.75)' }}
                                            onBlur={e => { e.currentTarget.style.borderColor = confirmForm.formState.errors.confirm ? '#f87171' : 'rgba(255,255,255,0.12)' }}
                                        />
                                        {confirmForm.formState.errors.confirm && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{confirmForm.formState.errors.confirm.message}</p>}
                                    </div>

                                    {error && (
                                        <div style={{
                                            padding: '12px 16px', borderRadius: '12px',
                                            backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                                            color: '#fca5a5', fontSize: '13px', lineHeight: 1.45,
                                        }}>{error}</div>
                                    )}

                                    <button type="submit" disabled={confirmForm.formState.isSubmitting} className="auth-submit-button" style={{
                                        marginTop: '6px', padding: '15px', borderRadius: '12px', fontSize: '16px',
                                        fontFamily: 'var(--font-body)', fontWeight: 600, cursor: confirmForm.formState.isSubmitting ? 'not-allowed' : 'pointer',
                                        border: 'none', opacity: confirmForm.formState.isSubmitting ? 0.72 : 1,
                                        background: 'linear-gradient(145deg, #1f4a32, #2d6a4f)',
                                        color: 'white', width: '100%', minHeight: '50px',
                                        boxShadow: '0 4px 16px rgba(26, 61, 43, 0.35)',
                                    }}>
                                        {confirmForm.formState.isSubmitting ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
                                    </button>
                                    
                                    <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.42)', marginTop: '16px', marginBottom: 0, lineHeight: 1.5 }}>
                                        <Link to="/login" style={{ color: '#6fcfa0', textDecoration: 'none', fontWeight: 600 }}>Giriş sayfasına dön</Link>
                                    </p>
                                </form>
                            </>
                        )
                    ) : sent ? (
                        <div style={{
                            textAlign: 'center', padding: '32px 16px',
                            backgroundColor: 'rgba(64,145,108,0.08)', borderRadius: '16px',
                            border: '1px solid rgba(64,145,108,0.22)',
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', marginBottom: '8px' }}>
                                E-posta gönderildi
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '24px' }}>
                                Eğer bu e-posta kayıtlıysa, sıfırlama bağlantısı gönderildi. Gelen kutunu kontrol et.
                            </p>
                            <Link to="/login" style={{
                                display: 'inline-block', padding: '12px 24px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.12)', color: 'white',
                                textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                            }}>
                                Giriş sayfasına dön
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 28px)', color: 'white', marginBottom: '8px', fontWeight: 700, lineHeight: 1.2 }}>
                                Şifreni sıfırla
                            </h2>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', lineHeight: 1.5 }}>
                                Kayıtlı e-posta adresini gir, sıfırlama bağlantısı gönderelim.
                            </p>

                            <form onSubmit={requestForm.handleSubmit(onRequest)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.72)' }}>E-posta</label>
                                    <input
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        {...requestForm.register('email')}
                                        className="auth-field-input"
                                        style={fieldStyle(!!requestForm.formState.errors.email)}
                                        onFocus={e => { e.currentTarget.style.borderColor = requestForm.formState.errors.email ? '#f87171' : 'rgba(64,145,108,0.75)' }}
                                        onBlur={e => { e.currentTarget.style.borderColor = requestForm.formState.errors.email ? '#f87171' : 'rgba(255,255,255,0.12)' }}
                                    />
                                    {requestForm.formState.errors.email && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{requestForm.formState.errors.email.message}</p>}
                                </div>

                                {error && (
                                    <div style={{
                                        padding: '12px 16px', borderRadius: '12px',
                                        backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                                        color: '#fca5a5', fontSize: '13px', lineHeight: 1.45,
                                    }}>{error}</div>
                                )}

                                <button type="submit" disabled={requestForm.formState.isSubmitting} className="auth-submit-button" style={{
                                    marginTop: '6px', padding: '15px', borderRadius: '12px', fontSize: '16px',
                                    fontFamily: 'var(--font-body)', fontWeight: 600, cursor: requestForm.formState.isSubmitting ? 'not-allowed' : 'pointer',
                                    border: 'none', opacity: requestForm.formState.isSubmitting ? 0.72 : 1,
                                    background: 'linear-gradient(145deg, #1f4a32, #2d6a4f)',
                                    color: 'white', width: '100%', minHeight: '50px',
                                    boxShadow: '0 4px 16px rgba(26, 61, 43, 0.35)',
                                }}>
                                    {requestForm.formState.isSubmitting ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                                </button>
                                
                                <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.42)', marginTop: '16px', marginBottom: 0, lineHeight: 1.5 }}>
                                    Şifreni hatırladın mı?{' '}
                                    <Link to="/login" style={{ color: '#6fcfa0', textDecoration: 'none', fontWeight: 600 }}>Giriş yap</Link>
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </AuthPageLayout>
    )
}

export default ResetPassword