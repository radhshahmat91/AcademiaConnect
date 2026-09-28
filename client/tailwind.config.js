/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Registrar's ledger meets modern app" — AcademiaConnect's brand palette.
        'forest-deep': '#0C231E', // deepest green — gradient depth for hero panels and the sidebar
        'forest-ink': '#14302A', // darkest green — sidebar surface, primary text on light bg
        forest: '#1F4D3F', // primary interactive — buttons, links, focus rings
        'forest-light': '#3D7A64', // hover states, secondary accents, success
        moss: '#E8F0EA', // soft green wash — hovers, selected rows, icon wells
        crest: '#BF9A3A', // gold accent — used sparingly for emphasis only
        'crest-light': '#E4C878',
        'crest-deep': '#8A6D20', // gold that is dark enough for text on light surfaces
        parchment: '#F3EEE0', // page background
        paper: '#FFFDF7', // card / surface background (a warm white, like the page it sits on)
        ink: '#201E1A', // body text
        'ink-muted': '#6B6558', // secondary text
        hairline: '#DDD3B8', // borders, dividers, ledger rule-lines
        brick: '#9B3B3B', // errors, "important" flags
      },
      fontFamily: {
        display: ['"Zilla Slab"', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      // A deliberate radius scale: small stamped labels, medium controls, larger surfaces.
      borderRadius: {
        sm: '5px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '22px',
      },
      // Shadows are tinted with the brand green rather than neutral grey.
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.75) inset, 0 1px 2px rgba(20,48,42,0.05), 0 8px 20px -12px rgba(20,48,42,0.16)',
        lift: '0 1px 0 rgba(255,255,255,0.75) inset, 0 2px 4px rgba(20,48,42,0.06), 0 20px 36px -16px rgba(20,48,42,0.36)',
        elevated: '0 32px 70px -26px rgba(12,35,30,0.6), 0 10px 26px -12px rgba(12,35,30,0.32)',
        btn: '0 1px 0 rgba(255,255,255,0.16) inset, 0 1px 2px rgba(20,48,42,0.35)',
        focus: '0 0 0 4px rgba(31,77,63,0.14)',
        gilt: '0 0 0 1px rgba(191,154,58,0.4), 0 10px 26px -12px rgba(191,154,58,0.7)',
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      // Keyframes live in src/index.css so they are always emitted; these are the utility handles.
      animation: {
        rise: 'rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'page-in': 'page-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'fade-in': 'fade-in 0.2s ease-out both',
        'fade-out': 'fade-out 0.18s ease-in both',
        'scale-in': 'scale-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-out': 'scale-out 0.18s ease-in both',
        pop: 'pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        shake: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'toast-out': 'toast-out 0.25s ease-in both',
        'spin-slow': 'spin 1.1s linear infinite',
      },
    },
  },
  plugins: [],
};
