import React from 'react'
import { Link } from 'react-router-dom'

/** Full-height auth shell with an in-flow footer (About / FAQ) — no overlap on side panels. */
export const AuthPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="auth-page-root">
        <div className="auth-page-row">
            {children}
        </div>
        <footer className="auth-page-footer">
            <nav className="auth-page-footer-inner" aria-label="Site information">
                <Link to="/about" className="auth-page-footer-link">
                    About us
                </Link>
                <span className="auth-page-footer-sep" aria-hidden="true" />
                <Link to="/faq" className="auth-page-footer-link">
                    FAQ
                </Link>
            </nav>
        </footer>
    </div>
)
