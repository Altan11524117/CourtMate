import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { adsApi } from '@/api/ads'
import { Navbar } from '@/components/Navbar'
import { getErrorMessage, toDatetimeLocalValue, fromDatetimeLocalToISO } from '@/utils'

const LEVELS = [
    'Beginner (ITN 10)',
    'Intermediate (ITN 7)',
    'Upper-Intermediate (ITN 5)',
    'Advanced (ITN 3)',
]
const CATEGORIES = ['Singles', 'Doubles', 'Training', 'Tournament']

const schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    category: z.string().optional(),
    location: z.string().min(2, 'Location is required'),
    requiredLevel: z.string().optional(),
    matchDate: z.string().min(1, 'Match date is required'),
})
type FormData = z.infer<typeof schema>

const inputStyle = (error?: boolean): React.CSSProperties => ({
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    fontFamily: 'var(--font-body)', boxSizing: 'border-box', outline: 'none',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1.5px solid ${error ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
    color: 'white', transition: 'border-color 0.2s',
})

const AdForm: React.FC = () => {
    const navigate = useNavigate()
    const { adId } = useParams<{ adId: string }>()
    const isEdit = !!adId
    const [error, setError] = useState('')

    const { data: existing } = useQuery({
        queryKey: ['ad', adId],
        queryFn: () => adsApi.getDetail(adId!),
        enabled: isEdit,
    })

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const watchCategory = watch('category')

    useEffect(() => {
        if (existing) {
            reset({
                title: existing.title ?? '',
                category: existing.category ?? '',
                location: existing.location ?? '',
                requiredLevel: existing.requiredLevel ?? '',
                matchDate: toDatetimeLocalValue(existing.matchDate),
            })
        }
    }, [existing, reset])

    const createMutation = useMutation({
        mutationFn: (data: FormData) => adsApi.create({
            ...data, category: data.category ?? '',
            requiredLevel: data.requiredLevel ?? '',
            matchDate: fromDatetimeLocalToISO(data.matchDate),
        }),
        onSuccess: (ad) => navigate(`/ads/${ad.id}`),
        onError: (err) => setError(getErrorMessage(err)),
    })

    const updateMutation = useMutation({
        mutationFn: (data: FormData) => adsApi.update(adId!, {
            ...data, category: data.category ?? '',
            requiredLevel: data.requiredLevel ?? '',
            matchDate: fromDatetimeLocalToISO(data.matchDate),
        }),
        onSuccess: () => navigate(`/ads/${adId}`),
        onError: (err) => setError(getErrorMessage(err)),
    })

    const onSubmit = (data: FormData) => {
        setError('')
        isEdit ? updateMutation.mutate(data) : createMutation.mutate(data)
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar />

            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px 60px' }}>

                {/* Back */}
                <button onClick={() => navigate(isEdit ? `/ads/${adId}` : '/ads')} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', fontSize: '13px',
                    fontFamily: 'var(--font-body)', marginBottom: '28px',
                    padding: 0, transition: 'color 0.18s',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {isEdit ? 'Back to Listing' : 'Back to Listings'}
                </button>

                {/* Form card */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', overflow: 'hidden',
                    animation: 'fadeUp 0.5s ease forwards',
                }}>
                    <div style={{ height: '4px', background: 'linear-gradient(90deg, #1a3d2b, #40916c, #c9a96e)' }} />

                    <div style={{ padding: '36px' }}>
                        <h1 style={{
                            fontFamily: 'var(--font-display)', fontSize: '26px',
                            color: 'white', fontWeight: 700, marginBottom: '6px',
                        }}>
                            {isEdit ? 'Edit Listing' : 'Post a Listing'}
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}>
                            {isEdit ? 'Update your match listing details.' : 'Fill in the details to find your tennis partner.'}
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* Title */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Listing Title</label>
                                <input
                                    placeholder="e.g. Looking for a doubles partner Saturday morning"
                                    {...register('title')}
                                    style={inputStyle(!!errors.title)}
                                    onFocus={e => e.currentTarget.style.borderColor = errors.title ? '#f87171' : 'rgba(64,145,108,0.6)'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.title ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                />
                                {errors.title && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.title.message}</p>}
                            </div>

                            {/* Category */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Category</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {CATEGORIES.map(cat => {
                                        const selected = watchCategory === cat
                                        return (
                                            <label key={cat} style={{ cursor: 'pointer' }}>
                                                <input type="radio" value={cat} {...register('category')} style={{ display: 'none' }} />
                                                <span style={{
                                                    display: 'inline-block', padding: '8px 16px', borderRadius: '8px',
                                                    fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-body)',
                                                    border: `1.5px solid ${selected ? '#40916c' : 'rgba(255,255,255,0.1)'}`,
                                                    backgroundColor: selected ? 'rgba(64,145,108,0.15)' : 'transparent',
                                                    color: selected ? '#6fcfa0' : 'rgba(255,255,255,0.45)',
                                                    transition: 'all 0.18s', cursor: 'pointer',
                                                }}>{cat}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Location */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Location</label>
                                <div style={{ position: 'relative' }}>
                                    <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }}
                                        width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <input
                                        placeholder="e.g. Istanbul, Kadıköy"
                                        {...register('location')}
                                        style={{ ...inputStyle(!!errors.location), paddingLeft: '38px' }}
                                        onFocus={e => e.currentTarget.style.borderColor = errors.location ? '#f87171' : 'rgba(64,145,108,0.6)'}
                                        onBlur={e => e.currentTarget.style.borderColor = errors.location ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                    />
                                </div>
                                {errors.location && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.location.message}</p>}
                            </div>

                            {/* Required Level */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
                                    Required Level <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>(optional)</span>
                                </label>
                                <select {...register('requiredLevel')} style={{
                                    ...inputStyle(), cursor: 'pointer',
                                    appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
                                }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(64,145,108,0.6)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                >
                                    <option value="" style={{ backgroundColor: '#1a1a1a' }}>Any level welcome</option>
                                    {LEVELS.map(l => <option key={l} value={l} style={{ backgroundColor: '#1a1a1a' }}>{l}</option>)}
                                </select>
                            </div>

                            {/* Match Date */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Match Date & Time</label>
                                <input
                                    type="datetime-local"
                                    {...register('matchDate')}
                                    style={{ ...inputStyle(!!errors.matchDate), colorScheme: 'dark' }}
                                    onFocus={e => e.currentTarget.style.borderColor = errors.matchDate ? '#f87171' : 'rgba(64,145,108,0.6)'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.matchDate ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                />
                                {errors.matchDate && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.matchDate.message}</p>}
                            </div>

                            {error && (
                                <div style={{
                                    padding: '12px 16px', borderRadius: '10px',
                                    backgroundColor: 'rgba(248,113,113,0.1)',
                                    border: '1px solid rgba(248,113,113,0.25)',
                                    color: '#fca5a5', fontSize: '13px',
                                }}>{error}</div>
                            )}

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <button type="button" onClick={() => navigate(isEdit ? `/ads/${adId}` : '/ads')} style={{
                                    flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px',
                                    fontWeight: 500, cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)',
                                    transition: 'all 0.18s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                                >
                                    Cancel
                                </button>
                                <button type="submit"
                                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                                    style={{
                                        flex: 2, padding: '12px', borderRadius: '10px', fontSize: '14px',
                                        fontWeight: 700, cursor: 'pointer', border: 'none',
                                        background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                                        color: 'white', transition: 'opacity 0.2s',
                                        opacity: isSubmitting || createMutation.isPending || updateMutation.isPending ? 0.65 : 1,
                                    }}
                                >
                                    {isSubmitting || createMutation.isPending || updateMutation.isPending
                                        ? 'Saving...'
                                        : isEdit ? 'Save Changes' : '🎾 Post Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdForm