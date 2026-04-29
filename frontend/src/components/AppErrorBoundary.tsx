import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { hasError: boolean; message: string }

export class AppErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, message: '' }

    static getDerivedStateFromError(err: Error): State {
        return { hasError: true, message: err.message || 'Something went wrong.' }
    }

    componentDidCatch(err: Error, info: ErrorInfo) {
        console.error('AppErrorBoundary', err, info.componentStack)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100dvh',
                    backgroundColor: '#0a0f0a',
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'var(--font-body)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px 24px',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                }}>
                    <p style={{ fontSize: '40px', marginBottom: '16px' }}>🎾</p>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '12px' }}>
                        Something broke
                    </h1>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '400px', marginBottom: '24px', lineHeight: 1.5 }}>
                        {this.state.message}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.assign('/ads')}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            background: 'linear-gradient(135deg, #1a3d2b, #2d6a4f)',
                            color: 'white',
                        }}
                    >
                        Back to listings
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}
