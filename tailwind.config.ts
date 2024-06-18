import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        lightblue: {
          DEFAULT: '#8FC1E3',
          foreground: 'hsl(var(--primary-foreground))',
        },
        darkgreen: {
          DEFAULT: '#687864',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        midblue: {
          DEFAULT: '#5085A5',
          foreground: 'hsl(var(--accent-foreground))',
        },
        darkblue: '#31708E',
        graywhite: '#F7F9FB',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#8FC1E3', // lightblue
          secondary: '#687864', // darkgreen
          accent: '#5085A5', // midblue
          neutral: '#3d4451', // default DaisyUI neutral color
          'base-100': '#F7F9FB', // graywhite
          info: '#2094f3', // default DaisyUI info color
          success: '#009485', // default DaisyUI success color
          warning: '#ff9900', // default DaisyUI warning color
          error: '#ff5724', // default DaisyUI error color
        },
      },
    ],
  },
  plugins: [
    require('tailwindcss-animate'),
    require('daisyui'),
    function (api: PluginAPI) {
      const { addBase, theme } = api;
      addBase({
        html: { fontFamily: theme('fontFamily.poppins') },
        body: { fontFamily: theme('fontFamily.poppins') },
      });
    },
  ],
};

export default config;
