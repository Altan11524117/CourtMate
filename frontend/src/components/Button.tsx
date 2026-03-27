import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    fullWidth?: boolean
    children: React.ReactNode
}

const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
        backgroundColor: 'var(--color-court-green)',
        color: 'var(--color-court-sand)',
        border: '1px solid var(--color-court-green)',
    },
    secondary: {
        backgroundColor: 'var(--color-court-clay)',
        color: 'var(--color-court-dark)',
        border: '1px solid var(--color-court-clay)',
    },
    outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-court-green)',
        border: '1px solid var(--color-court-green)',
    },
    ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-court-muted)',
        border: '1px solid transparent',
    },
    danger: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: '1px solid #dc2626',
    },
}

const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '8px 18px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '15px' },
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    children,
    style,
    disabled,
    ...props
}) => {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                borderRadius: '10px',
                cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: disabled || loading ? 0.55 : 1,
                transition: 'all 0.2s',
                width: fullWidth ? '100%' : undefined,
                whiteSpace: 'nowrap',
                ...variantStyles[variant],
                ...sizeStyles[size],
                ...style,
            }}
        >
            {loading ? (
                <span style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map(i => (
                        <span key={i} style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: 'currentColor',
                            animation: 'pulseDot 1.5s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`,
                        }} />
                    ))}
                </span>
            ) : children}
        </button>
    )
}