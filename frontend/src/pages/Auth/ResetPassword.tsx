import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { getErrorMessage } from '@/utils'

const requestSchema = z.object({
    email: z.string().email('Geçerli bir e-posta girin'),
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

export const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [sent, setSent] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

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
            setTimeout(() => navigate('/login'), 2500)
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    return (
        <div className="min-h-screen bg-court-dark bg-court-lines flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-court-cream rounded-2xl shadow-2xl p-8 animate-fade-up">
                <Link to="/login"
                    className="inline-flex items-center gap-1 text-court-muted hover:text-court-green text-sm font-body mb-6 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Geri dön
                </Link>

                <div className="w-12 h-12 rounded-xl bg-court-green/10 flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-court-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>

                {/* Confirm mode (token in URL) */}
                {token ? (
                    done ? (
                        <div className="text-center animate-fade-in">
                            <div className="text-4xl mb-3">🔐</div>
                            <h3 className="font-display text-xl text-court-green mb-1">Şifre güncellendi!</h3>
                            <p className="text-court-muted text-sm font-body">Giriş sayfasına yönlendiriliyorsunuz...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="font-display text-2xl text-court-dark mb-1">Yeni şifre belirle</h2>
                            <p className="text-court-muted text-sm font-body mb-6">Yeni şifreni gir ve hesabına geri dön.</p>
                            <form onSubmit={confirmForm.handleSubmit(onConfirm)} className="flex flex-col gap-4">
                                <Input
                                    label="Yeni Şifre"
                                    type="password"
                                    placeholder="••••••••"
                                    error={confirmForm.formState.errors.newPassword?.message}
                                    {...confirmForm.register('newPassword')}
                                />
                                <Input
                                    label="Şifre Tekrar"
                                    type="password"
                                    placeholder="••••••••"
                                    error={confirmForm.formState.errors.confirm?.message}
                                    {...confirmForm.register('confirm')}
                                />
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-body px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                )}
                                <Button type="submit" fullWidth size="lg"
                                    loading={confirmForm.formState.isSubmitting}>
                                    Şifremi Güncelle
                                </Button>
                            </form>
                        </>
                    )
                ) : sent ? (
                    <div className="text-center animate-fade-in">
                        <div className="text-4xl mb-3">📬</div>
                        <h3 className="font-display text-xl text-court-dark mb-2">E-posta gönderildi</h3>
                        <p className="text-court-muted text-sm font-body leading-relaxed">
                            Eğer bu e-posta kayıtlıysa, sıfırlama bağlantısı gönderildi. Gelen kutunu kontrol et.
                        </p>
                        <Button variant="outline" fullWidth className="mt-6" onClick={() => navigate('/login')}>
                            Giriş sayfasına dön
                        </Button>
                    </div>
                ) : (
                    <>
                        <h2 className="font-display text-2xl text-court-dark mb-1">Şifreni sıfırla</h2>
                        <p className="text-court-muted text-sm font-body mb-6">
                            Kayıtlı e-posta adresini gir, sıfırlama bağlantısı gönderelim.
                        </p>
                        <form onSubmit={requestForm.handleSubmit(onRequest)} className="flex flex-col gap-4">
                            <Input
                                label="E-posta"
                                type="email"
                                placeholder="ornek@mail.com"
                                error={requestForm.formState.errors.email?.message}
                                {...requestForm.register('email')}
                            />
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-body px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" fullWidth size="lg"
                                loading={requestForm.formState.isSubmitting}>
                                Sıfırlama Bağlantısı Gönder
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
export default ResetPassword