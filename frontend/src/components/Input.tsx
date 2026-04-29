import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, style, ...props }, ref) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {label && (
                    <label style={{
                        fontSize: '13px', fontWeight: 500,
                        color: 'var(--color-court-dark)',
                        fontFamily: 'var(--font-body)',
                    }}>
                        {label}
                    </label>
                )}
                <div style={{ position: 'relative' }}>
                    {leftIcon && (
                        <span style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-court-muted)',
                            display: 'flex', alignItems: 'center',
                        }}>
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        style={{
                            width: '100%',
                            padding: `10px ${rightIcon ? '40px' : '14px'} 10px ${leftIcon ? '40px' : '14px'}`,
                            borderRadius: '10px',
                            border: `1.5px solid ${error ? '#f87171' : '#e5e7eb'}`,
                            backgroundColor: 'white',
                            fontSize: '14px',
                            fontFamily: 'var(--font-body)',
                            color: 'var(--color-court-dark)',
                            outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            boxSizing: 'border-box',
                            ...style,
                        }}
                        onFocus={e => {
                            e.currentTarget.style.borderColor = error ? '#f87171' : 'var(--color-court-greenMid)'
                            e.currentTarget.style.boxShadow = error
                                ? '0 0 0 3px rgba(248,113,113,0.15)'
                                : '0 0 0 3px rgba(64,145,108,0.12)'
                        }}
                        onBlur={e => {
                            e.currentTarget.style.borderColor = error ? '#f87171' : '#e5e7eb'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    />
                    {rightIcon && (
                        <span style={{
                            position: 'absolute', right: '12px', top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-court-muted)',
                            display: 'flex', alignItems: 'center',
                        }}>
                            {rightIcon}
                        </span>
                    )}
                </div>
                {error && <p style={{ fontSize: '12px', color: '#ef4444', fontFamily: 'var(--font-body)', margin: 0 }}>{error}</p>}
                {hint && !error && <p style={{ fontSize: '12px', color: 'var(--color-court-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>{hint}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'