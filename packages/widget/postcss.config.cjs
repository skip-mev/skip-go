/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-prefixwrap')('.skip-go-widget'),
  ],
};
