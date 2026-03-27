import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Ad } from '@/types'
import { formatDateShort, truncate } from '@/utils'

interface AdCardProps { ad: Ad; delay?: number }

const statusLabel: Record<string, string> = { open: 'Open', filled: 'Filled', cancelled: 'Cancelled' }

const statusStyle = (s: string): React.CSSProperties => ({
    open: { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.25)' },
    filled: { backgroundColor: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.25)' },
    cancelled: { backgroundColor: 'rgba(248,113,113,0.12)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' },
}[s] ?? { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' })

const levelStyle = (l: string): React.CSSProperties => {
    if (l.includes('Advanced')) return { backgroundColor: 'rgba(64,145,108,0.15)', color: '#6fcfa0', border: '1px solid rgba(64,145,108,0.2)' }
    if (l.includes('Upper-Intermediate')) return { backgroundColor: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }
    if (l.includes('Intermediate')) return { backgroundColor: 'rgba(201,169,110,0.15)', color: '#e4c07a', border: '1px solid rgba(201,169,110,0.25)' }
    return { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }
}

export const AdCard: React.FC<AdCardProps> = ({ ad, delay = 0 }) => {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate(`/ads/${ad.id}`)}
            style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', cursor: 'pointer', overflow: 'hidden',
                transition: 'all 0.22s', animation: 'fadeUp 0.5s ease forwards',
                animationDelay: `${delay}ms`, opacity: 0,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.borderColor = 'rgba(64,145,108,0.35)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Top accent */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #1a3d2b, #40916c, #c9a96e)' }} />

            <div style={{ padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                    <h3 style={{
                        fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600,
                        color: 'white', lineHeight: 1.35, margin: 0,
                    }}>
                        {truncate(ad.title, 52)}
                    </h3>
                    <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                        borderRadius: '99px', whiteSpace: 'nowrap', flexShrink: 0,
                        fontFamily: 'var(--font-body)', ...statusStyle(ad.status),
                    }}>
                        {statusLabel[ad.status] ?? ad.status}
                    </span>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '16px' }}>
                    {[
                        {
                            icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                            text: ad.location,
                        },
                        {
                            icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" /></svg>,
                            text: formatDateShort(ad.matchDate),
                        },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'var(--font-body)' }}>
                            {item.icon}{item.text}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {ad.category
                        ? <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.08)' }}>{ad.category}</span>
                        : <span />
                    }
                    {ad.requiredLevel && (
                        <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-body)', padding: '3px 10px', borderRadius: '99px', ...levelStyle(ad.requiredLevel) }}>
                            {ad.requiredLevel.split(' ')[0]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}