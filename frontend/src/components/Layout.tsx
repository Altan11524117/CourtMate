import React from 'react'
import { Navbar } from './Navbar'

interface LayoutProps {
    children: React.ReactNode
    fullWidth?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0a', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                {fullWidth ? children : (
                    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box' }}>
                        {children}
                    </div>
                )}
            </main>
            <footer style={{
                backgroundColor: '#060e06',
                color: 'rgba(255,255,255,0.2)',
                textAlign: 'center',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                padding: '20px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                © 2026 CourtMate · Find your tennis partner, hit the court.
            </footer>
        </div>
    )
}