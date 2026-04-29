import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { usersApi } from '@/api/users'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/Navbar'
import { getErrorMessage } from '@/utils'

const schema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    preferredHand: z.string().optional(),
    bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
})
type FormData = z.infer<typeof schema>

const HANDS = ['Right', 'Left', 'Both']

const levelStyle = (l: string): React.CSSProperties => {
    if (l.includes('Advanced')) return { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.25)' }
    if (l.includes('Upper-Intermediate')) return { backgroundColor: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }
    if (l.includes('Intermediate')) return { backgroundColor: 'rgba(201,169,110,0.15)', color: '#e4c07a', border: '1px solid rgba(201,169,110,0.25)' }
    return { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }
}

const inputStyle = (error?: boolean): React.CSSProperties => ({
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    fontFamily: 'var(--font-body)', boxSizing: 'border-box', outline: 'none',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1.5px solid ${error ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
    color: 'white', transition: 'border-color 0.2s',
})

const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const qc = useQueryClient()
    const { user: me, setUser, logout } = useAuthStore()

    const isOwn = me?.id === userId

    const [editing, setEditing] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [updateError, setUpdateError] = useState('')
    const [toast, setToast] = useState(false)

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => usersApi.getProfile(userId!),
        enabled: !!userId,
    })

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema, { jitless: true }),
        values: {
            fullName: profile?.fullName ?? '',
            preferredHand: profile?.preferredHand ?? '',
            bio: profile?.bio ?? '',
        },
    })

    const watchHand = watch('preferredHand')

    const updateMutation = useMutation({
        mutationFn: (data: FormData) => usersApi.updateProfile(userId!, {
            fullName: data.fullName,
            preferredHand: data.preferredHand,
            bio: data.bio,
        }),
        onSuccess: (updated) => {
            setUser(updated)
            qc.invalidateQueries({ queryKey: ['profile', userId] })
            setEditing(false)
            setToast(true)
            setTimeout(() => setToast(false), 3000)
        },
        onError: (err) => setUpdateError(getErrorMessage(err)),
    })

    const deleteMutation = useMutation({
        mutationFn: () => usersApi.deleteUser(userId!),
        onSuccess: () => { logout(); navigate('/login') },
    })

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
                <Navbar />
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[220, 300, 160].map((h, i) => (
                        <div key={i} style={{
                            height: `${h}px`, borderRadius: '20px',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            animation: 'pulse 1.8s ease-in-out infinite',
                            animationDelay: `${i * 0.15}s`,
                        }} />
                    ))}
                </div>
            </div>
        )
    }

    // ── Not found ─────────────────────────────────────────────────────────────
    if (!profile) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '20px' }}>User not found.</p>
                    <button onClick={() => navigate('/ads')} style={{
                        padding: '11px 24px', borderRadius: '10px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer', border: 'none',
                        backgroundColor: '#40916c', color: 'white',
                    }}>Go to Listings</button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar />

            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 60px' }}>

                {/* ── Profile hero card ── */}
                <div style={{
                    borderRadius: '24px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '16px',
                    animation: 'fadeUp 0.5s ease forwards',
                }}>
                    {/* Banner */}
                    <div style={{
                        height: '100px',
                        background: 'linear-gradient(135deg, #0f1f0f 0%, #1a3d2b 50%, #0f2a1a 100%)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }} />
                        <div style={{
                            position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 65%)',
                            top: '-100px', right: '-60px', pointerEvents: 'none',
                        }} />
                    </div>

                    {/* Profile content */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '0 32px 32px' }}>

                        {/* Avatar row */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px', marginTop: '-28px', position: 'relative', zIndex: 10 }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '18px', flexShrink: 0,
                                background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid #0a0f0a',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}>
                                <span style={{ color: 'white', fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                                    {profile.fullName?.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {isOwn && !editing && (
                                <button
                                    onClick={() => {
                                        reset({ fullName: profile.fullName ?? '', preferredHand: profile.preferredHand ?? '', bio: profile.bio ?? '' })
                                        setEditing(true)
                                    }}
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                                        fontWeight: 500, cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)',
                                        transition: 'all 0.18s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'white' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Name + badges */}
                        <h1 style={{
                            fontFamily: 'var(--font-display)', fontSize: '24px',
                            color: 'white', fontWeight: 700, marginBottom: '12px',
                        }}>
                            {profile.fullName}
                        </h1>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                            {profile.level ? (
                                <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 14px', borderRadius: '99px', ...levelStyle(profile.level) }}>
                                    {profile.level}
                                </span>
                            ) : (
                                <span style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    No level assigned
                                </span>
                            )}
                            {profile.preferredHand && (
                                <span style={{ fontSize: '12px', fontWeight: 500, padding: '4px 14px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {profile.preferredHand} handed
                                </span>
                            )}
                            {profile.isActive && (
                                <span style={{ fontSize: '12px', fontWeight: 500, padding: '4px 14px', borderRadius: '99px', backgroundColor: 'rgba(64,145,108,0.1)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.2)' }}>
                                    ● Active
                                </span>
                            )}
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                                {profile.bio}
                            </p>
                        )}

                        {/* No level CTA */}
                        {isOwn && !profile.level && (
                            <div style={{
                                marginTop: '20px', padding: '16px 18px', borderRadius: '12px',
                                backgroundColor: 'rgba(201,169,110,0.08)',
                                border: '1px solid rgba(201,169,110,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                gap: '16px', flexWrap: 'wrap',
                            }}>
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#e4c07a', margin: '0 0 3px' }}>
                                        You haven't taken the placement exam yet.
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                                        Get your ITN level to find the right partners.
                                    </p>
                                </div>
                                <button onClick={() => navigate('/exam')} style={{
                                    padding: '9px 18px', borderRadius: '8px', fontSize: '13px',
                                    fontWeight: 600, cursor: 'pointer', border: 'none',
                                    backgroundColor: '#c9a96e', color: '#0a0f0a', flexShrink: 0,
                                }}>
                                    Take Exam →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Edit form ── */}
                {isOwn && editing && (
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px', overflow: 'hidden',
                        marginBottom: '16px',
                        animation: 'fadeUp 0.35s ease forwards',
                    }}>
                        <div style={{ height: '3px', background: 'linear-gradient(90deg, #1a3d2b, #40916c, #c9a96e)' }} />
                        <div style={{ padding: '28px 32px' }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'white', marginBottom: '24px' }}>
                                Edit Profile
                            </h2>

                            <form onSubmit={handleSubmit(d => { setUpdateError(''); updateMutation.mutate(d) })}
                                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                                {/* Full name */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>Full Name</label>
                                    <input
                                        placeholder="Your full name"
                                        {...register('fullName')}
                                        style={inputStyle(!!errors.fullName)}
                                        onFocus={e => e.currentTarget.style.borderColor = errors.fullName ? '#f87171' : 'rgba(64,145,108,0.6)'}
                                        onBlur={e => e.currentTarget.style.borderColor = errors.fullName ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                    />
                                    {errors.fullName && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.fullName.message}</p>}
                                </div>

                                {/* Preferred hand */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>Preferred Hand</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {HANDS.map(hand => {
                                            const selected = watchHand === hand
                                            return (
                                                <label key={hand} style={{ cursor: 'pointer' }}>
                                                    <input type="radio" value={hand} {...register('preferredHand')} style={{ display: 'none' }} />
                                                    <span style={{
                                                        display: 'inline-block', padding: '9px 18px', borderRadius: '8px',
                                                        fontSize: '13px', fontWeight: 500,
                                                        border: `1.5px solid ${selected ? '#40916c' : 'rgba(255,255,255,0.1)'}`,
                                                        backgroundColor: selected ? 'rgba(64,145,108,0.15)' : 'transparent',
                                                        color: selected ? '#6fcfa0' : 'rgba(255,255,255,0.45)',
                                                        transition: 'all 0.18s', cursor: 'pointer',
                                                    }}>{hand}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Bio */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>
                                        Bio <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>(optional)</span>
                                    </label>
                                    <textarea
                                        {...register('bio')}
                                        rows={3}
                                        placeholder="Tell others about your playing style, availability..."
                                        style={{
                                            ...inputStyle(!!errors.bio),
                                            resize: 'vertical', lineHeight: 1.6,
                                        }}
                                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(64,145,108,0.6)'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                    {errors.bio && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errors.bio.message}</p>}
                                </div>

                                {updateError && (
                                    <div style={{
                                        padding: '12px 16px', borderRadius: '10px',
                                        backgroundColor: 'rgba(248,113,113,0.1)',
                                        border: '1px solid rgba(248,113,113,0.25)',
                                        color: '#fca5a5', fontSize: '13px',
                                    }}>{updateError}</div>
                                )}

                                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                    <button type="button" onClick={() => setEditing(false)} style={{
                                        flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px',
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
                                    <button type="submit" disabled={isSubmitting || updateMutation.isPending} style={{
                                        flex: 2, padding: '11px', borderRadius: '10px', fontSize: '14px',
                                        fontWeight: 700, cursor: 'pointer', border: 'none',
                                        background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                                        color: 'white', transition: 'opacity 0.2s',
                                        opacity: isSubmitting || updateMutation.isPending ? 0.65 : 1,
                                    }}>
                                        {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Stats row ── */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '12px', marginBottom: '16px',
                    animation: 'fadeUp 0.5s ease forwards', animationDelay: '100ms',
                }}>
                    {[
                        {
                            label: 'Member since',
                            value: profile.createdAt
                                ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                : '—',
                        },
                        {
                            label: 'Account status',
                            value: profile.isActive ? 'Active' : 'Inactive',
                            highlight: profile.isActive,
                        },
                    ].map(item => (
                        <div key={item.label} style={{
                            padding: '20px 22px', borderRadius: '16px',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                        }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {item.label}
                            </div>
                            <div style={{
                                fontSize: '15px', fontWeight: 600,
                                color: item.highlight ? '#6fcfa0' : 'white',
                            }}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Danger zone ── */}
                {isOwn && (
                    <div style={{
                        padding: '24px 28px', borderRadius: '20px',
                        backgroundColor: 'rgba(248,113,113,0.04)',
                        border: '1px solid rgba(248,113,113,0.12)',
                        animation: 'fadeUp 0.5s ease forwards', animationDelay: '150ms',
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#fca5a5', marginBottom: '6px' }}>
                            Danger Zone
                        </h3>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px', lineHeight: 1.6 }}>
                            Permanently deletes your account and all associated data. This action cannot be undone.
                        </p>

                        {!deleteConfirm ? (
                            <button onClick={() => setDeleteConfirm(true)} style={{
                                padding: '9px 20px', borderRadius: '8px', fontSize: '13px',
                                fontWeight: 600, cursor: 'pointer',
                                border: '1px solid rgba(248,113,113,0.3)',
                                backgroundColor: 'rgba(248,113,113,0.08)', color: '#fca5a5',
                                transition: 'all 0.18s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.08)'}
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fca5a5', margin: 0 }}>
                                    Are you absolutely sure? This cannot be reversed.
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setDeleteConfirm(false)} style={{
                                        padding: '10px 20px', borderRadius: '8px', fontSize: '13px',
                                        fontWeight: 500, cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)',
                                        transition: 'all 0.18s',
                                    }}>
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => deleteMutation.mutate()}
                                        disabled={deleteMutation.isPending}
                                        style={{
                                            padding: '10px 20px', borderRadius: '8px', fontSize: '13px',
                                            fontWeight: 700, cursor: 'pointer', border: 'none',
                                            backgroundColor: '#dc2626', color: 'white',
                                            opacity: deleteMutation.isPending ? 0.6 : 1,
                                            transition: 'all 0.18s',
                                        }}
                                        onMouseEnter={e => !deleteMutation.isPending && (e.currentTarget.style.backgroundColor = '#b91c1c')}
                                        onMouseLeave={e => !deleteMutation.isPending && (e.currentTarget.style.backgroundColor = '#dc2626')}
                                    >
                                        {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete My Account'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
                    padding: '14px 20px', borderRadius: '12px',
                    backgroundColor: 'rgba(64,145,108,0.9)',
                    border: '1px solid rgba(64,145,108,0.5)',
                    backdropFilter: 'blur(10px)',
                    color: 'white', fontSize: '14px', fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    animation: 'fadeUp 0.3s ease forwards',
                    display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                    ✅ Profile updated successfully!
                </div>
            )}
        </div>
    )
}

export default ProfilePage