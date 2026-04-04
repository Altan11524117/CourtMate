import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adsApi } from '@/api/ads'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/Navbar'
import { formatDate, getErrorMessage } from '@/utils'

const levelStyle = (l: string | undefined | null): React.CSSProperties => {
    if (l == null || l === '') {
        return { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }
    }
    if (l.includes('Advanced')) return { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.2)' }
    if (l.includes('Upper-Intermediate')) return { backgroundColor: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }
    if (l.includes('Intermediate')) return { backgroundColor: 'rgba(201,169,110,0.15)', color: '#e4c07a', border: '1px solid rgba(201,169,110,0.25)' }
    return { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }
}

const statusStyle = (s: string): React.CSSProperties => ({
    open: { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.25)' },
    filled: { backgroundColor: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.25)' },
    cancelled: { backgroundColor: 'rgba(248,113,113,0.12)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' },
}[s] ?? { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' })

const AdDetail: React.FC = () => {
    const { adId } = useParams<{ adId: string }>()
    const navigate = useNavigate()
    const qc = useQueryClient()
    const { user } = useAuthStore()

    const [applyError, setApplyError] = useState('')
    const [applySuccess, setApplySuccess] = useState(false)

    const { data: ad, isPending: adLoading, error } = useQuery({
        queryKey: ['ad', adId],
        queryFn: () => adsApi.getDetail(adId!),
        enabled: !!adId,
    })

    const { data: applications = [] } = useQuery({
        queryKey: ['applications', adId],
        queryFn: () => adsApi.listApplications(adId!),
        enabled: !!adId && !!user && ad?.ownerId === user?.id,
    })

    const applyMutation = useMutation({
        mutationFn: () => adsApi.apply(adId!),
        onSuccess: () => setApplySuccess(true),
        onError: (err) => setApplyError(getErrorMessage(err)),
    })

    const statusMutation = useMutation({
        mutationFn: ({ appId, status }: { appId: string; status: 'approved' | 'rejected' }) =>
            adsApi.updateApplicationStatus(adId!, appId, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['applications', adId] }),
    })

    const deleteMutation = useMutation({
        mutationFn: () => adsApi.delete(adId!),
        onSuccess: () => navigate('/ads'),
    })

    const isOwner = user?.id === ad?.ownerId

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar />

            {/* Loading */}
            {adLoading && (
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
                    <div style={{ height: '400px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.04)', animation: 'pulse 1.8s ease-in-out infinite' }} />
                </div>
            )}

            {/* Error */}
            {(error || (!adLoading && !ad)) && (
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎾</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', marginBottom: '10px' }}>Listing not found</h3>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '28px' }}>This listing may have been removed.</p>
                    <button onClick={() => navigate('/ads')} style={{
                        padding: '11px 28px', borderRadius: '10px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer', border: 'none',
                        backgroundColor: '#40916c', color: 'white',
                    }}>Back to Listings</button>
                </div>
            )}

            {ad && (
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px 60px' }}>

                    {/* Back button */}
                    <button onClick={() => navigate('/ads')} style={{
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
                        Back to Listings
                    </button>

                    {/* Main card */}
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px', overflow: 'hidden',
                        marginBottom: '16px',
                        animation: 'fadeUp 0.5s ease forwards',
                    }}>
                        {/* Accent bar */}
                        <div style={{ height: '4px', background: 'linear-gradient(90deg, #1a3d2b, #40916c, #c9a96e)' }} />

                        <div style={{ padding: '32px' }}>

                            {/* Header */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                                        <span style={{
                                            fontSize: '11px', fontWeight: 600, padding: '4px 12px',
                                            borderRadius: '99px', fontFamily: 'var(--font-body)',
                                            ...statusStyle(ad.status),
                                        }}>
                                            {ad.status === 'open' ? 'Open' : ad.status === 'filled' ? 'Filled' : 'Cancelled'}
                                        </span>
                                        {ad.category && (
                                            <span style={{
                                                fontSize: '11px', fontWeight: 500, padding: '4px 12px',
                                                borderRadius: '99px', fontFamily: 'var(--font-body)',
                                                backgroundColor: 'rgba(255,255,255,0.06)',
                                                color: 'rgba(255,255,255,0.45)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}>{ad.category}</span>
                                        )}
                                    </div>
                                    <h1 style={{
                                        fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)',
                                        color: 'white', fontWeight: 700, lineHeight: 1.25, margin: 0,
                                    }}>{ad.title}</h1>
                                </div>

                                {/* View count */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    color: 'rgba(255,255,255,0.25)', fontSize: '13px',
                                    flexShrink: 0,
                                }}>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {ad.viewCount} views
                                </div>
                            </div>

                            {/* Detail grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                                {[
                                    {
                                        icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                                        label: 'Location', value: ad.location,
                                    },
                                    {
                                        icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" /></svg>,
                                        label: 'Match Date', value: formatDate(ad.matchDate),
                                    },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                                        padding: '16px', borderRadius: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                    }}>
                                        <span style={{ color: '#40916c', marginTop: '1px', flexShrink: 0 }}>{item.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                                            <div style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Required level */}
                            {ad.requiredLevel && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Required level</span>
                                    <span style={{
                                        fontSize: '12px', fontWeight: 600, padding: '4px 12px',
                                        borderRadius: '99px', fontFamily: 'var(--font-body)',
                                        ...levelStyle(ad.requiredLevel),
                                    }}>{ad.requiredLevel}</span>
                                </div>
                            )}

                            {/* Owner card */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '16px', borderRadius: '12px',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                marginBottom: '28px',
                            }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                    background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
                                        {ad.ownerProfileSummary?.fullName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                                        {ad.ownerProfileSummary?.fullName}
                                    </div>
                                    {ad.ownerProfileSummary?.level && (
                                        <span style={{
                                            fontSize: '11px', fontWeight: 600, padding: '2px 10px',
                                            borderRadius: '99px', ...levelStyle(ad.ownerProfileSummary.level),
                                        }}>{ad.ownerProfileSummary.level}</span>
                                    )}
                                </div>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>Posted by</span>
                            </div>

                            {/* Actions */}
                            {isOwner ? (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button onClick={() => navigate(`/ads/${adId}/edit`)} style={{
                                        flex: 1, minWidth: '120px', padding: '12px', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)',
                                        transition: 'all 0.18s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'white' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                                    >
                                        Edit Listing
                                    </button>
                                    <button
                                        onClick={() => { if (confirm('Delete this listing?')) deleteMutation.mutate() }}
                                        disabled={deleteMutation.isPending}
                                        style={{
                                            flex: 1, minWidth: '120px', padding: '12px', borderRadius: '10px',
                                            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                            border: '1px solid rgba(248,113,113,0.3)',
                                            backgroundColor: 'rgba(248,113,113,0.08)', color: '#fca5a5',
                                            transition: 'all 0.18s', opacity: deleteMutation.isPending ? 0.6 : 1,
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.15)'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.08)'}
                                    >
                                        {deleteMutation.isPending ? 'Deleting...' : 'Delete Listing'}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {applySuccess ? (
                                        <div style={{
                                            padding: '16px', borderRadius: '12px', textAlign: 'center',
                                            backgroundColor: 'rgba(64,145,108,0.12)',
                                            border: '1px solid rgba(64,145,108,0.25)',
                                            animation: 'fadeIn 0.4s ease forwards',
                                        }}>
                                            <p style={{ color: '#6fcfa0', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                                                ✅ Application submitted! The owner will review it shortly.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setApplyError(''); applyMutation.mutate() }}
                                                disabled={ad.status !== 'open' || applyMutation.isPending}
                                                style={{
                                                    width: '100%', padding: '14px', borderRadius: '12px',
                                                    fontSize: '15px', fontWeight: 700, cursor: ad.status !== 'open' ? 'not-allowed' : 'pointer',
                                                    border: 'none', transition: 'all 0.2s',
                                                    opacity: ad.status !== 'open' ? 0.5 : 1,
                                                    background: ad.status === 'open'
                                                        ? 'linear-gradient(135deg, #1a3d2b, #2d6a4f)'
                                                        : 'rgba(255,255,255,0.06)',
                                                    color: ad.status === 'open' ? 'white' : 'rgba(255,255,255,0.3)',
                                                }}
                                                onMouseEnter={e => ad.status === 'open' && (e.currentTarget.style.opacity = '0.88')}
                                                onMouseLeave={e => ad.status === 'open' && (e.currentTarget.style.opacity = '1')}
                                            >
                                                {applyMutation.isPending ? 'Submitting...' : ad.status === 'open' ? '🎾 Apply to this Match' : 'Listing Closed'}
                                            </button>
                                            {applyError && (
                                                <p style={{ color: '#fca5a5', fontSize: '13px', marginTop: '10px', textAlign: 'center' }}>{applyError}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Applications panel — owner only */}
                    {isOwner && (
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '20px', overflow: 'hidden',
                            animation: 'fadeUp 0.5s ease forwards',
                            animationDelay: '120ms',
                        }}>
                            <div style={{
                                padding: '20px 28px',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'white', margin: 0 }}>
                                    Applications
                                </h2>
                                <span style={{
                                    fontSize: '12px', fontWeight: 600, padding: '3px 12px',
                                    borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.06)',
                                    color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                                }}>
                                    {applications.length} applicant{applications.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {applications.length === 0 ? (
                                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '14px', margin: 0 }}>No applications yet.</p>
                                </div>
                            ) : (
                                <div>
                                    {applications.map((app, i) => (
                                        <div key={app.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            padding: '18px 28px',
                                            borderBottom: i < applications.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                            flexWrap: 'wrap',
                                        }}>
                                            <div style={{
                                                width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                                                background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>
                                                    {app.applicantName?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div style={{ flex: 1, minWidth: '120px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                                                    {app.applicantName}
                                                </div>
                                                {app.applicantLevel && (
                                                    <span style={{
                                                        fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                                                        borderRadius: '99px', ...levelStyle(app.applicantLevel),
                                                    }}>{app.applicantLevel}</span>
                                                )}
                                            </div>

                                            {app.status === 'pending' ? (
                                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                    <button
                                                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'approved' })}
                                                        disabled={statusMutation.isPending}
                                                        style={{
                                                            padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                                                            fontWeight: 600, cursor: 'pointer', border: 'none',
                                                            backgroundColor: 'rgba(64,145,108,0.2)', color: '#6fcfa0',
                                                            transition: 'all 0.18s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(64,145,108,0.35)'}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(64,145,108,0.2)'}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'rejected' })}
                                                        disabled={statusMutation.isPending}
                                                        style={{
                                                            padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                                                            fontWeight: 600, cursor: 'pointer', border: 'none',
                                                            backgroundColor: 'rgba(248,113,113,0.12)', color: '#fca5a5',
                                                            transition: 'all 0.18s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.22)'}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.12)'}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{
                                                    fontSize: '12px', fontWeight: 600, padding: '4px 12px',
                                                    borderRadius: '99px', flexShrink: 0,
                                                    ...(app.status === 'approved'
                                                        ? { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.25)' }
                                                        : { backgroundColor: 'rgba(248,113,113,0.12)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' }
                                                    ),
                                                }}>
                                                    {app.status
                                                        ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                                                        : '—'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdDetail