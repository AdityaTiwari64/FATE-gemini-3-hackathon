/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'fate-black': '#000000',
                'fate-dark': '#0a0a0a',
                'fate-card': '#111111',
                'fate-orange': '#f97316',
                'fate-orange-light': '#fb923c',
                'fate-gray': '#262626',
                'fate-text': '#a3a3a3',
                'fate-muted': '#525252',
            },
            fontFamily: {
                'heading': ['Space Grotesk', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
