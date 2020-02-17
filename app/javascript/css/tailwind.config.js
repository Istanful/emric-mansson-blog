const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    boxShadow: {
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0)'
    },
    extend: {
      colors: {
        blue: '#3b57bf',
        gray: {
          ...colors.gray,
          '100': '#fbfdfe'
        }
      }
    },
    screens: {
      md: '768px',
    },
    container: {
      center: true,
      padding: '1.5rem',
    }
  },
  variants: {},
  plugins: [],
}
