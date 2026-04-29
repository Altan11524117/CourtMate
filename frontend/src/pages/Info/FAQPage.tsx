import React, { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { InteractiveCourtGrid } from '@/components/InteractiveCourtGrid'

type Item = { q: string; a: string }

const faqItems: Item[] = [
    {
        q: 'What is CourtMate?',
        a: 'CourtMate is a tennis partner network. You can browse open match listings, post your own game, and see players by level so you know what kind of hit to expect.',
    },
    {
        q: 'How do listings work?',
        a: 'Head to Listings to see posts from other players. Each listing describes the match type, level, and location. You can use filters to narrow things down, then open a listing for full details.',
    },
    {
        q: 'What is the level exam?',
        a: 'The level exam helps place you on a consistent skill scale (similar idea to ITN-style levels). After you sign up, you can take it so your profile shows other players how you play — useful for fairer, more fun matches.',
    },
    {
        q: 'Do I need to pay to use the app?',
        a: 'No. CourtMate is built as a straightforward tool for finding partners and organising games — no paid tiers or subscriptions in this version.',
    },
    {
        q: 'How do I create an account?',
        a: 'Use “Get started” or Register with your name, email, and password. After that you can complete your profile and take the level exam when you are ready.',
    },
    {
        q: 'What if I forgot my password?',
        a: 'On the login page, use “Forgot password?” to start a reset. Follow the steps we send to your email to set a new password.',
    },
]

const FAQPage: React.FC = () => {
    const baseId = useId().replace(/:/g, '')
    const [open, setOpen] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpen(prev => (prev === index ? null : index))
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', fontFamily: 'var(--font-body)' }}>
            <Navbar />

            <InteractiveCourtGrid
                style={{
                    background: 'linear-gradient(155deg, #0f1f0f 0%, #1a3d2b 55%, #0f1a0f 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '48px 24px 44px',
                }}
                innerStyle={{ maxWidth: '640px', margin: '0 auto' }}
                baseLineAlpha={0.025}
            >
                <p style={{
                    fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '3px',
                    textTransform: 'uppercase', marginBottom: '12px', fontWeight: 500,
                }}>
                    Help
                </p>
                <h1 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 36px)',
                    color: 'white', fontWeight: 700, lineHeight: 1.15, margin: '0 0 12px',
                }}>
                    Frequently asked{' '}
                    <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>questions</span>
                </h1>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
                    Short answers about how CourtMate works. Still stuck? Reach out through your listing or profile flow in the app.
                </p>
                <Link
                    to="/about"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px',
                        color: '#6fcfa0', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                        padding: '8px 14px', marginLeft: '-14px', borderRadius: '10px',
                        transition: 'background-color 0.18s, transform 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(64,145,108,0.1)'
                        e.currentTarget.style.transform = 'translateX(-2px)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.transform = 'translateX(0)'
                    }}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    About us
                </Link>
            </InteractiveCourtGrid>

            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px 80px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {faqItems.map((item, index) => {
                        const isOpen = open === index
                        const panelId = `${baseId}-panel-${index}`
                        const headerId = `${baseId}-header-${index}`
                        return (
                            <div
                                key={item.q}
                                style={{
                                    borderRadius: '14px',
                                    border: `1px solid ${isOpen ? 'rgba(64,145,108,0.35)' : 'rgba(255,255,255,0.08)'}`,
                                    backgroundColor: isOpen ? 'rgba(64,145,108,0.06)' : 'rgba(255,255,255,0.03)',
                                    overflow: 'hidden',
                                    transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                                    boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
                                }}
                            >
                                <button
                                    type="button"
                                    id={headerId}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => toggle(index)}
                                    style={{
                                        width: '100%', padding: '16px 18px', textAlign: 'left', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                                        background: 'none', border: 'none', color: 'white',
                                        fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600,
                                    }}
                                >
                                    <span style={{ lineHeight: 1.35 }}>{item.q}</span>
                                    <span
                                        aria-hidden
                                        style={{
                                            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            backgroundColor: isOpen ? 'rgba(64,145,108,0.2)' : 'rgba(255,255,255,0.06)',
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.25s ease, background-color 0.2s ease',
                                        }}
                                    >
                                        <svg width="18" height="18" fill="none" stroke="#6fcfa0" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={headerId}
                                    style={{
                                        maxHeight: isOpen ? '480px' : '0',
                                        opacity: isOpen ? 1 : 0,
                                        transition: 'max-height 0.35s ease, opacity 0.25s ease',
                                        pointerEvents: isOpen ? 'auto' : 'none',
                                    }}
                                >
                                    <p style={{
                                        margin: '0 18px 18px', paddingTop: 0,
                                        fontSize: '14px', lineHeight: 1.65, color: 'rgba(255,255,255,0.55)',
                                    }}>
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <footer style={{
                backgroundColor: '#060e06', borderTop: '1px solid rgba(255,255,255,0.05)',
                padding: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.28)',
            }}>
                © 2026 CourtMate ·{' '}
                <Link to="/about" style={{ color: '#40916c', textDecoration: 'none' }}>About</Link>
                {' · '}
                <Link to="/ads" style={{ color: '#40916c', textDecoration: 'none' }}>Listings</Link>
            </footer>
        </div>
    )
}

export default FAQPage
