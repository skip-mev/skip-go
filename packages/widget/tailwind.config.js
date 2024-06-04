/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/ui/**/*.tsx'],
  purge: ['./src/ui/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
    },
  },
};
