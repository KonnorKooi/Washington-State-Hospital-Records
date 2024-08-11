import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

const colors = {
  lightblue: '#8FC1E3',
  darkgreen: '#687864',
  midblue: '#5085A5',
  darkblue: '#31708E',
  graywhite: '#F7F9FB',
};

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
        primary: colors.lightblue,
        secondary: colors.darkgreen,
        accent: colors.midblue,
        background: colors.graywhite,
        text: {
          DEFAULT: colors.darkblue,
          light: colors.graywhite,
        },
        ...colors, // Include original color names for backward compatibility
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
          primary: colors.lightblue,
          secondary: colors.darkgreen,
          accent: colors.midblue,
          neutral: '#3d4451', // default DaisyUI neutral color
          'base-100': colors.graywhite,
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
