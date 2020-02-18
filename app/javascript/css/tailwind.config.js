const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      colors: {
        blue: '#5c77ce',
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
    },
  },
  variants: {},
  plugins: [],
}
