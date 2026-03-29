import React, { useCallback, useState } from 'react'

export type InteractiveCourtGridProps = {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    /** Flex / layout for the content area above the grid */
    innerStyle?: React.CSSProperties
    gridSize?: number
    spotlightRadius?: number
    /** Opacity of base grid lines (0–1) */
    baseLineAlpha?: number
    /** Peak opacity of grid lines under the spotlight */
    highlightLineAlpha?: number
}

export const InteractiveCourtGrid: React.FC<InteractiveCourtGridProps> = ({
    children,
    className,
    style,
    innerStyle,
    gridSize = 60,
    spotlightRadius = 260,
    baseLineAlpha = 0.03,
    highlightLineAlpha = 0.11,
}) => {
    const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)

    const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPointer({ x: e.clientX - r.left, y: e.clientY - r.top })
    }, [])

    const onLeave = useCallback(() => setPointer(null), [])

    const baseGrid = `
        linear-gradient(rgba(255,255,255,${baseLineAlpha}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,${baseLineAlpha}) 1px, transparent 1px)
    `
    const hiA = highlightLineAlpha * 0.92
    const hiGrid = `
        linear-gradient(rgba(255,255,255,${highlightLineAlpha}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,${hiA}) 1px, transparent 1px)
    `
    const mask = pointer
        ? `radial-gradient(circle ${spotlightRadius}px at ${pointer.x}px ${pointer.y}px, black 0%, transparent 68%)`
        : 'none'

    return (
        <div
            className={className}
            style={{ ...style, position: 'relative', overflow: 'hidden' }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: baseGrid,
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                    pointerEvents: 'none',
                }}
            />
            {pointer && (
                <>
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: hiGrid,
                            backgroundSize: `${gridSize}px ${gridSize}px`,
                            WebkitMaskImage: mask,
                            maskImage: mask,
                            pointerEvents: 'none',
                            transition: 'opacity 0.12s ease-out',
                        }}
                    />
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute',
                            left: pointer.x,
                            top: pointer.y,
                            width: spotlightRadius * 2.4,
                            height: spotlightRadius * 2.4,
                            transform: 'translate(-50%, -50%)',
                            background:
                                'radial-gradient(circle, rgba(201,169,110,0.12) 0%, rgba(64,145,108,0.08) 38%, transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />
                </>
            )}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    width: '100%',
                    ...innerStyle,
                }}
            >
                {children}
            </div>
        </div>
    )
}
