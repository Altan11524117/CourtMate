import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { InteractiveCourtGrid } from '@/components/InteractiveCourtGrid'

const founders = [
    {
        name: 'Arif Yavuz',
        role: 'Co-creator',
        blurb: 'Ideas, product, and making the court feel easy to find.',
    },
    {
        name: 'Altan Aydın',
        role: 'Co-creator',
        blurb: 'Building the experience behind the net — simple and welcoming.',
    },
]

const AboutPage: React.FC = () => {
    const [hovered, setHovered] = useState<string | null>(null)

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar />

            <InteractiveCourtGrid
                style={{
                    background: 'linear-gradient(155deg, #0f1f0f 0%, #1a3d2b 55%, #0f1a0f 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '48px 24px 56px',
                }}
                innerStyle={{ maxWidth: '720px', margin: '0 auto' }}
                baseLineAlpha={0.025}
            >
                <p style={{
                    fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '3px',
                    textTransform: 'uppercase', marginBottom: '12px', fontWeight: 500,
                }}>
                    CourtMate
                </p>
                <h1 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)',
                    color: 'white', fontWeight: 700, lineHeight: 1.15, margin: '0 0 16px',
                }}>
                    About <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>us</span>
                </h1>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: 0, maxWidth: '560px' }}>
                    We built CourtMate to help tennis players find real partners, real courts, and real matches — without the noise.
                    List your game, browse open matches, and use the level exam so everyone speaks the same language on court.
                </p>
                <Link
                    to="/faq"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '24px',
                        color: '#6fcfa0', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                        padding: '10px 18px', borderRadius: '10px',
                        border: '1px solid rgba(64,145,108,0.35)', backgroundColor: 'rgba(64,145,108,0.08)',
                        transition: 'background-color 0.18s, border-color 0.18s, transform 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(64,145,108,0.15)'
                        e.currentTarget.style.borderColor = 'rgba(64,145,108,0.55)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(64,145,108,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(64,145,108,0.35)'
                        e.currentTarget.style.transform = 'translateY(0)'
                    }}
                >
                    Common questions
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </InteractiveCourtGrid>

            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white',
                    marginBottom: '8px', fontWeight: 700,
                }}>
                    Who we are
                </h2>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', marginBottom: '28px', lineHeight: 1.6 }}>
                    CourtMate is a small project by two people who love the game and wanted a cleaner way to organise a hit.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {founders.map(f => (
                        <article
                            key={f.name}
                            onMouseEnter={() => setHovered(f.name)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                textAlign: 'left', padding: '22px', borderRadius: '16px',
                                border: `1px solid ${hovered === f.name ? 'rgba(201,169,110,0.45)' : 'rgba(255,255,255,0.08)'}`,
                                backgroundColor: hovered === f.name ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                                boxShadow: hovered === f.name ? '0 12px 40px rgba(0,0,0,0.35)' : 'none',
                                transform: hovered === f.name ? 'translateY(-4px)' : 'translateY(0)',
                                transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
                                fontFamily: 'var(--font-body)', color: 'inherit',
                            }}
                        >
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px', marginBottom: '14px',
                                background: hovered === f.name
                                    ? 'linear-gradient(135deg, #40916c, #c9a96e)'
                                    : 'linear-gradient(135deg, rgba(64,145,108,0.5), rgba(201,169,110,0.4))',
                                transition: 'background 0.22s ease',
                            }} />
                            <div style={{ fontSize: '13px', color: '#6fcfa0', fontWeight: 600, marginBottom: '6px' }}>{f.role}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'white', fontWeight: 700, marginBottom: '10px' }}>
                                {f.name}
                            </div>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
                                {f.blurb}
                            </p>
                        </article>
                    ))}
                </div>
            </div>

            <footer style={{
                backgroundColor: '#060e06', borderTop: '1px solid rgba(255,255,255,0.05)',
                padding: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.28)',
            }}>
                © 2026 CourtMate ·{' '}
                <Link to="/faq" style={{ color: '#40916c', textDecoration: 'none' }}>FAQ</Link>
                {' · '}
                <Link to="/ads" style={{ color: '#40916c', textDecoration: 'none' }}>Listings</Link>
            </footer>
        </div>
    )
}

export default AboutPage
