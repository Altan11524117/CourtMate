import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div style={{
            minHeight: '100vh', backgroundColor: '#0a0f0a',
            fontFamily: 'var(--font-body)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', position: 'relative', overflow: 'hidden',
        }}>
            {/* Grid background */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
            }} />
            <div style={{
                position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(64,145,108,0.08) 0%, transparent 65%)',
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none',
            }} />

            <div style={{ textAlign: 'center', position: 'relative', animation: 'fadeUp 0.5s ease forwards' }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(80px, 15vw, 140px)',
                    fontWeight: 700, lineHeight: 1,
                    color: 'rgba(255,255,255,0.04)',
                    marginBottom: '8px', userSelect: 'none',
                }}>
                    404
                </div>
                <div style={{ fontSize: '48px', marginBottom: '20px', marginTop: '-20px' }}>🎾</div>
                <h1 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)',
                    color: 'white', fontWeight: 700, marginBottom: '12px',
                }}>
                    Out of bounds.
                </h1>
                <p style={{
                    fontSize: '15px', color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 36px',
                }}>
                    The page you're looking for has gone out of the court. Let's get you back in the game.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/ads')} style={{
                        padding: '12px 28px', borderRadius: '10px', fontSize: '14px',
                        fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                        color: 'white', transition: 'opacity 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Back to Listings
                    </button>
                    <button onClick={() => navigate(-1)} style={{
                        padding: '12px 24px', borderRadius: '10px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.55)',
                        transition: 'all 0.18s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                    >
                        Go Back
                    </button>
                </div>
                <p style={{ marginTop: '28px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                    <Link to="/about" style={{ color: '#40916c', textDecoration: 'none', marginRight: '14px' }}>About</Link>
                    <Link to="/faq" style={{ color: '#40916c', textDecoration: 'none' }}>FAQ</Link>
                </p>
            </div>
        </div>
    )
}

export default NotFound