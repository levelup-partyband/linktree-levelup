/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: 'rgb(var(--c-bg-soft) / <alpha-value>)',
          'navy-deep': 'rgb(var(--c-bg-base) / <alpha-value>)',
          pink: 'rgb(var(--c-accent) / <alpha-value>)',
          'pink-hot': 'rgb(var(--c-accent) / <alpha-value>)',
          'pink-dark': 'rgb(var(--c-accent-dark) / <alpha-value>)',
          purple: 'rgb(var(--c-accent-2) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Cocomat Pro', 'sans-serif'],
        body: ['Cocomat Pro', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(236, 18, 137, 0.35)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-18px) translateX(6px)' },
        },
        floatyAlt: {
          '0%,100%': { transform: 'translateY(0) translateX(0) scale(1)' },
          '50%': { transform: 'translateY(14px) translateX(-8px) scale(1.05)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        wobble: {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg) scale(1)' },
          '25%': { transform: 'translate(10px,8px) rotate(-3deg) scale(1.04)' },
          '75%': { transform: 'translate(-8px,-6px) rotate(3deg) scale(0.97)' },
        },
        drift2: {
          '0%,100%': { transform: 'translate(0,0)' },
          '33%': { transform: 'translate(-22px,12px)' },
          '66%': { transform: 'translate(14px,-18px)' },
        },
        floatyDeep: {
          '0%,100%': { transform: 'translateY(0) translateX(0) scale(1)' },
          '50%': { transform: 'translateY(-28px) translateX(12px) scale(1.07)' },
        },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        floatyAlt: 'floatyAlt 9s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        wobble: 'wobble 11s ease-in-out infinite',
        drift2: 'drift2 16s ease-in-out infinite',
        floatyDeep: 'floatyDeep 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
