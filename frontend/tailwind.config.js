/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                court: {
                    green: '#1a3d2b',
                    greenLight: '#2d6a4f',
                    greenMid: '#40916c',
                    sand: '#f5e6c8',
                    sandLight: '#fdf6e3',
                    cream: '#fffdf7',
                    clay: '#c9a96e',
                    clayDark: '#a07840',
                    dark: '#0f1f17',
                    muted: '#6b7c6e',
                },
            },
            fontFamily: {
                display: ['"Playfair Display"', 'Georgia', 'serif'],
                body: ['"DM Sans"', 'sans-serif'],
            },
            backgroundImage: {
                'court-lines': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 59px,
          rgba(255,255,255,0.04) 59px,
          rgba(255,255,255,0.04) 60px
        ), repeating-linear-gradient(
          90deg,
          transparent,
          transparent 59px,
          rgba(255,255,255,0.04) 59px,
          rgba(255,255,255,0.04) 60px
        )`,
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease forwards',
                'fade-in': 'fadeIn 0.4s ease forwards',
                'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseDot: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.4)', opacity: '0.6' },
                },
            },
        },
    },
    plugins: [],
}