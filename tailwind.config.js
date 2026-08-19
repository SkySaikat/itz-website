/** @type {import('tailwindcss').Config} */

/*
 * ITZ Digital — design tokens
 * ---------------------------------------------------------------------------
 * Palette extracted from the live WordPress build (Elementor global kit +
 * rendered CSS at https://itzdigital.co):
 *
 *   Primary    #00386C  deep navy      — headings, dark sections, footer
 *   Secondary  #0974E4  bright blue    — primary CTA, links, eyebrows
 *   Accent     #FBBB5B  amber          — icon strokes, underlines, doodles
 *   Background #FFFFFF  white          — page canvas
 *   Surface    #F4F6FB  pale blue-grey — alternating section bands
 *   Ink        #0B1220  near-black     — body copy (was pure #000; softened
 *                                        so long-form text stops vibrating)
 *
 * Each hue is expanded to a 50–950 ramp so contrast pairs are pickable
 * rather than guessed. Brand hexes sit at the 700 / 500 / 400 steps.
 */

const navy = {
  50: '#EEF4FB',
  100: '#D7E5F5',
  200: '#AFCAEA',
  300: '#7FA8DA',
  400: '#4A80C4',
  500: '#215BA4',
  600: '#0F4586',
  700: '#00386C', // brand primary
  800: '#0B2D57', // deep section fill
  900: '#0A2245',
  950: '#06162C',
};

const blue = {
  50: '#EAF4FE',
  100: '#D0E6FD',
  200: '#A3CCFB',
  300: '#6FADF6',
  400: '#3B8FF0',
  500: '#0974E4', // brand secondary
  600: '#075CBC',
  700: '#064A97',
  800: '#073C79',
  900: '#0A3363',
  950: '#061F3F',
};

const amber = {
  50: '#FEF8ED',
  100: '#FDEDCE',
  200: '#FCDD9D',
  300: '#FBCB74',
  400: '#FBBB5B', // brand accent
  500: '#F5A02A',
  600: '#DC8014',
  700: '#B65F12',
  800: '#934B16',
  900: '#783F15',
  950: '#451F07',
};

const ink = {
  50: '#F6F7F9',
  100: '#ECEEF2',
  200: '#D5DAE3',
  300: '#B0BAC9',
  400: '#8593A8',
  500: '#64748B', // muted body copy
  600: '#4C5A70',
  700: '#3D4859',
  800: '#333C4B',
  900: '#1E2735',
  950: '#0B1220', // primary body copy
};

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    // NOTE: Tailwind's `container` plugin is disabled (see `corePlugins`
    // below) and `.container` is defined by hand in globals.css instead.
    // Reason: `theme.container.padding` keys are resolved against
    // `theme.container.screens`, so overriding `screens` to just `2xl` — as
    // this config did — silently dropped the sm/lg/xl padding steps and left
    // every breakpoint on the 20px default.
    extend: {
      colors: {
        navy,
        blue,
        amber,
        ink,

        // Semantic aliases — prefer these in components so a rebrand is a
        // one-file change.
        brand: {
          DEFAULT: navy[700],
          primary: navy[700],
          secondary: blue[500],
          accent: amber[400],
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F4F6FB', // pale band between white sections
          dark: navy[800],
          darker: navy[950],
        },
      },

      fontFamily: {
        // Greycliff CF (licensed, used on the live site) → Figtree is the
        // closest free geometric humanist with the same double-storey `a`,
        // tall x-height and rounded terminals.
        sans: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Verveine (licensed) → Caveat matches the casual marker-pen eyebrows
        // and "Let's revolutionize your ad strategy!" flourishes.
        script: ['var(--font-caveat)', 'ui-serif', 'cursive'],
      },

      fontSize: {
        // Fluid display sizes: no jump between the 390px phone and 1440px desktop.
        'display-xl': ['clamp(2.5rem, 1.6rem + 4.2vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['clamp(2.125rem, 1.5rem + 2.8vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-md': ['clamp(1.75rem, 1.3rem + 2vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['clamp(1.5rem, 1.25rem + 1.1vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.12em', fontWeight: '700' }],
      },

      spacing: {
        // Section rhythm. `section` is the mobile band, `section-lg` the desktop
        // one — roughly 1.6x the original site's padding for more breathing room.
        section: '4.5rem',
        'section-lg': '7.5rem',
        // Minimum accessible tap target (WCAG 2.2 AA "Target Size (Minimum)"
        // asks for 24px; 48px is the Material/Apple comfort target).
        tap: '3rem',
      },

      minHeight: { tap: '3rem' },
      minWidth: { tap: '3rem' },

      maxWidth: {
        prose: '68ch',
        measure: '46rem',
      },

      borderRadius: {
        '4xl': '2rem',
        pill: '999px',
      },

      boxShadow: {
        // Blue-tinted shadows read as "lift" against the pale blue surfaces;
        // neutral grey shadows look muddy on #F4F6FB.
        card: '0 1px 2px rgba(9,44,90,0.04), 0 8px 24px -8px rgba(9,44,90,0.12)',
        'card-hover': '0 2px 4px rgba(9,44,90,0.06), 0 20px 44px -12px rgba(9,44,90,0.22)',
        cta: '0 8px 20px -4px rgba(9,116,228,0.42)',
        'cta-hover': '0 12px 28px -6px rgba(9,116,228,0.55)',
        ring: '0 0 0 1px rgba(9,44,90,0.08)',
      },

      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #0974E4 0%, #075CBC 100%)',
        'gradient-navy': 'linear-gradient(165deg, #0B2D57 0%, #00386C 55%, #075CBC 100%)',
        'dot-grid': 'radial-gradient(currentColor 1.5px, transparent 1.5px)',
      },

      // Distinct key from backgroundImage.dot-grid so the two utilities do not
      // collide on the same class name.
      backgroundSize: { dots: '14px 14px' },

      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        drift: {
          from: { transform: 'translate3d(0,0,0) scale(1)' },
          to: { transform: 'translate3d(3%, -4%, 0) scale(1.08)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-down': 'slide-down 0.18s ease-out both',
      },

      typography: (theme) => ({
        brand: {
          css: {
            '--tw-prose-body': theme('colors.ink.700'),
            '--tw-prose-headings': theme('colors.navy.700'),
            '--tw-prose-links': theme('colors.blue.600'),
            '--tw-prose-bold': theme('colors.navy.800'),
            '--tw-prose-bullets': theme('colors.amber.400'),
            '--tw-prose-quotes': theme('colors.navy.700'),
            '--tw-prose-quote-borders': theme('colors.amber.400'),
            maxWidth: '68ch',
            lineHeight: '1.75',
          },
        },
      }),
    },
  },
  corePlugins: { container: false },

  plugins: [require('@tailwindcss/typography')],
};
