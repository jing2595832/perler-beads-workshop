/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        background: '#F7F7F7',
        text: '#2C3E50',
        border: '#2C3E50'
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        body: ['system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
