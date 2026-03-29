import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export const Navbar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isAuthenticated, logout } = useAuthStore()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => { setOpen(false) }, [location.pathname])

    const handleLogout = async () => {
        try { await authApi.logout() } catch { }
        logout()
        navigate('/login')
    }

    const isActive = (path: string) => location.pathname.startsWith(path)

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#0d1a0d',
            borderBottom: `1px solid rgba(255,255,255,0.08)`,
            boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
            transition: 'all 0.3s',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            fontFamily: 'var(--font-body)',
        }}>
            <div style={{
                maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', height: '64px', gap: '16px',
            }}>

                {/* ── Logo ── */}
                <Link to="/ads" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1a3d2b, #40916c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(64,145,108,0.4)',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M4.5 9 Q12 4 19.5 9" />
                            <path d="M4.5 15 Q12 20 19.5 15" />
                            <line x1="12" y1="2" x2="12" y2="22" />
                        </svg>
                    </div>
                    <span style={{
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: '20px', color: 'white', letterSpacing: '-0.3px',
                    }}>
                        Court<span style={{ color: '#c9a96e' }}>Mate</span>
                    </span>
                </Link>

                {/* ── Center nav (desktop) ── */}
                <div className="nav-desktop" style={{
                    display: 'flex', alignItems: 'center', gap: '2px',
                    flex: 1, justifyContent: 'center',
                }}>
                    {[
                        { label: 'Listings', path: '/ads' },
                        { label: 'Level Exam', path: '/exam' },
                        { label: 'About', path: '/about' },
                        { label: 'FAQ', path: '/faq' },
                    ].map(link => (
                        <Link key={link.path} to={link.path} style={{
                            padding: '7px 18px', borderRadius: '8px', fontSize: '14px',
                            fontFamily: 'var(--font-body)', fontWeight: isActive(link.path) ? 600 : 400,
                            textDecoration: 'none',
                            color: isActive(link.path) ? '#6fcfa0' : 'rgba(255,255,255,0.5)',
                            backgroundColor: isActive(link.path) ? 'rgba(64,145,108,0.12)' : 'transparent',
                            transition: 'all 0.18s', position: 'relative',
                        }}
                            onMouseEnter={e => {
                                if (!isActive(link.path)) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive(link.path)) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                                }
                            }}
                        >
                            {link.label}
                            {isActive(link.path) && (
                                <span style={{
                                    position: 'absolute', bottom: '-2px',
                                    left: '18px', right: '18px', height: '2px',
                                    backgroundColor: '#40916c', borderRadius: '2px',
                                }} />
                            )}
                        </Link>
                    ))}
                </div>

                {/* ── Right side (desktop) ── */}
                <div className="nav-desktop" style={{
                    display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
                }}>
                    {isAuthenticated && user ? (
                        <>
                            {/* Profile pill */}
                            <button
                                onClick={() => user?.id && navigate(`/profile/${user.id}`)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '5px 12px 5px 5px', borderRadius: '99px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'rgba(64,145,108,0.5)'
                                    e.currentTarget.style.backgroundColor = 'rgba(64,145,108,0.08)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                                }}
                            >
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                                    {user?.fullName?.split(' ')[0]}
                                </span>
                                {user?.level && (
                                    <span style={{
                                        fontSize: '11px', fontWeight: 600, color: '#6fcfa0',
                                        backgroundColor: 'rgba(64,145,108,0.15)',
                                        padding: '2px 8px', borderRadius: '99px',
                                        border: '1px solid rgba(64,145,108,0.2)',
                                    }}>
                                        {user.level.split(' ')[0]}
                                    </span>
                                )}
                            </button>

                            {/* Post ad */}
                            <button
                                onClick={() => navigate('/ads/create')}
                                style={{
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                                    fontWeight: 600, cursor: 'pointer', border: 'none',
                                    backgroundColor: '#c9a96e', color: '#0a0f0a', transition: 'all 0.18s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b8945a'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#c9a96e'}
                            >
                                + Post Ad
                            </button>

                            {/* Sign out */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
                                    fontWeight: 500, cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'transparent', color: 'rgba(255,255,255,0.4)',
                                    transition: 'all 0.18s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'
                                    e.currentTarget.style.color = '#fca5a5'
                                    e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.06)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} style={{
                                padding: '8px 18px', borderRadius: '8px', fontSize: '13px',
                                fontWeight: 500, cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.12)',
                                backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)',
                                transition: 'all 0.18s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'white' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                            >
                                Sign In
                            </button>
                            <button onClick={() => navigate('/register')} style={{
                                padding: '8px 20px', borderRadius: '8px', fontSize: '13px',
                                fontWeight: 600, cursor: 'pointer', border: 'none',
                                backgroundColor: '#40916c', color: 'white', transition: 'all 0.18s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2d6a4f'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#40916c'}
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>

                {/* ── Mobile hamburger ── */}
                <button
                    className="nav-mobile"
                    onClick={() => setOpen(!open)}
                    style={{
                        background: 'none', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.6)', padding: '7px',
                        display: 'none', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.18s',
                    }}
                >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {open
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* ── Mobile menu ── */}
            {open && (
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: '#060e06',
                    padding: '12px 20px 20px',
                }}>
                    {/* Nav links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
                        {[
                            { label: 'Listings', path: '/ads' },
                            { label: 'Level Exam', path: '/exam' },
                            { label: 'About', path: '/about' },
                            { label: 'FAQ', path: '/faq' },
                        ].map(link => (
                            <Link key={link.path} to={link.path} style={{
                                padding: '11px 14px', borderRadius: '8px', fontSize: '15px',
                                fontWeight: isActive(link.path) ? 600 : 400, textDecoration: 'none',
                                color: isActive(link.path) ? '#6fcfa0' : 'rgba(255,255,255,0.55)',
                                backgroundColor: isActive(link.path) ? 'rgba(64,145,108,0.1)' : 'transparent',
                            }}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', gap: '8px',
                        borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px',
                    }}>
                        {isAuthenticated && user ? (
                            <>
                                {/* Profile */}
                                <button
                                    onClick={() => user?.id && navigate(`/profile/${user.id}`)}
                                    style={{
                                        padding: '12px 14px', borderRadius: '10px', fontSize: '14px',
                                        fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.8)',
                                        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                                    }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #40916c, #c9a96e)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <span style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>
                                            {user?.fullName?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                                            {user?.fullName}
                                        </div>
                                        {user?.level && (
                                            <div style={{ fontSize: '11px', color: '#6fcfa0', marginTop: '2px' }}>
                                                {user.level}
                                            </div>
                                        )}
                                    </div>
                                    <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Post ad */}
                                <button
                                    onClick={() => navigate('/ads/create')}
                                    style={{
                                        padding: '12px', borderRadius: '10px', fontSize: '14px',
                                        fontWeight: 600, cursor: 'pointer', border: 'none',
                                        backgroundColor: '#c9a96e', color: '#0a0f0a',
                                    }}
                                >
                                    + Post a Listing
                                </button>

                                {/* Sign out */}
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        padding: '12px', borderRadius: '10px', fontSize: '14px',
                                        fontWeight: 500, cursor: 'pointer',
                                        border: '1px solid rgba(248,113,113,0.2)',
                                        backgroundColor: 'rgba(248,113,113,0.06)', color: '#fca5a5',
                                    }}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')} style={{
                                    padding: '12px', borderRadius: '10px', fontSize: '14px',
                                    fontWeight: 500, cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)',
                                }}>
                                    Sign In
                                </button>
                                <button onClick={() => navigate('/register')} style={{
                                    padding: '12px', borderRadius: '10px', fontSize: '14px',
                                    fontWeight: 600, cursor: 'pointer', border: 'none',
                                    backgroundColor: '#40916c', color: 'white',
                                }}>
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}