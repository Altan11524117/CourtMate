import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adsApi } from '@/api/ads'
import { AdCard } from '@/components/AdCard'
import { Navbar } from '@/components/Navbar'
import { InteractiveCourtGrid } from '@/components/InteractiveCourtGrid'

const CATEGORIES = ['Singles', 'Doubles', 'Training', 'Tournament']
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'level_asc', label: 'Level ↑' },
    { value: 'level_desc', label: 'Level ↓' },
]

const AdList: React.FC = () => {
    const navigate = useNavigate()
    const [location, setLocation] = useState('')
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState<'newest' | 'oldest' | 'level_asc' | 'level_desc'>('newest')
    const [searching, setSearching] = useState(false)

    const { data: adsRaw, isLoading, refetch } = useQuery({
        queryKey: ['ads', location, category, sort, searching],
        queryFn: () =>
            searching || location || category
                ? adsApi.search({ category: category || undefined, location: location || undefined, sort })
                : adsApi.list({ limit: 20 }),
    })
    const ads = adsRaw ?? []

    const handleSearch = () => { setSearching(true); refetch() }
    const handleClear = () => { setLocation(''); setCategory(''); setSort('newest'); setSearching(false) }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar /> {/* Navbar buraya eklendi */}

            <InteractiveCourtGrid
                style={{
                    background: 'linear-gradient(160deg, #0f1f0f 0%, #1a3d2b 60%, #0f1a0f 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '56px 24px 48px',
                }}
                innerStyle={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}
                baseLineAlpha={0.025}
            >
                <div style={{
                    position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(64,145,108,0.12) 0%, transparent 65%)',
                    top: '-100px', right: '-80px', pointerEvents: 'none',
                }} />
                <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '36px' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 500 }}>
                                Open Matches
                            </p>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', color: 'white', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
                                Find your next<br />
                                <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>tennis match.</span>
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate('/ads/create')}
                            style={{
                                padding: '12px 24px', borderRadius: '10px', fontSize: '14px',
                                fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
                                border: 'none', backgroundColor: '#c9a96e', color: '#0a0f0a',
                                transition: 'all 0.2s', flexShrink: 0,
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b8945a'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#c9a96e'}
                        >
                            + Post a Listing
                        </button>
                    </div>

                    {/* Search / filter bar */}
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        alignItems: 'center',
                        backdropFilter: 'blur(10px)',
                    }}>
                        {/* Location input */}
                        <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}
                                width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <input
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by location..."
                                style={{
                                    width: '100%', padding: '10px 14px 10px 36px', borderRadius: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', fontSize: '13px', outline: 'none',
                                    fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(64,145,108,0.6)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        {/* Category pills */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setCategory(category === cat ? '' : cat)} style={{
                                    padding: '8px 14px', borderRadius: '8px', fontSize: '12px',
                                    fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer',
                                    border: `1px solid ${category === cat ? '#40916c' : 'rgba(255,255,255,0.1)'}`,
                                    backgroundColor: category === cat ? 'rgba(64,145,108,0.2)' : 'transparent',
                                    color: category === cat ? '#6fcfa0' : 'rgba(255,255,255,0.5)',
                                    transition: 'all 0.18s',
                                }}>
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} style={{
                            padding: '9px 12px', borderRadius: '8px', fontSize: '12px',
                            fontFamily: 'var(--font-body)', cursor: 'pointer',
                            backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)', outline: 'none',
                        }}>
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ backgroundColor: '#1a1a1a' }}>{o.label}</option>)}
                        </select>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleSearch} style={{
                                padding: '9px 20px', borderRadius: '8px', fontSize: '13px',
                                fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
                                border: 'none', backgroundColor: '#40916c', color: 'white', transition: 'all 0.18s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2d6a4f'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#40916c'}
                            >
                                Search
                            </button>
                            {(location || category || searching) && (
                                <button onClick={handleClear} style={{
                                    padding: '9px 16px', borderRadius: '8px', fontSize: '13px',
                                    fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent',
                                    color: 'rgba(255,255,255,0.5)', transition: 'all 0.18s',
                                }}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </InteractiveCourtGrid>

            {/* Content */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Result count */}
                {!isLoading && ads.length > 0 && (
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px', fontWeight: 500 }}>
                        {ads.length} listing{ads.length !== 1 ? 's' : ''} found
                    </p>
                )}

                {/* Skeletons */}
                {isLoading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} style={{
                                height: '200px', borderRadius: '16px',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                animation: 'pulse 1.8s ease-in-out infinite',
                                animationDelay: `${i * 0.1}s`,
                            }} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && ads.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', fontSize: '32px',
                        }}>🎾</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', marginBottom: '10px' }}>
                            No listings found
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '28px' }}>
                            Try adjusting your filters or be the first to post a match!
                        </p>
                        <button onClick={() => navigate('/ads/create')} style={{
                            padding: '12px 28px', borderRadius: '10px', fontSize: '14px',
                            fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
                            border: 'none', backgroundColor: '#40916c', color: 'white',
                        }}>
                            Post a Listing
                        </button>
                    </div>
                )}

                {/* Ad grid */}
                {!isLoading && ads.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {ads.map((ad, i) => <AdCard key={ad.id} ad={ad} delay={i * 50} />)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdList