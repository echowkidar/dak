/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // flex: {
      //   'basis-10%': '0 0 10%',
      //   'basis-80%': '0 0 80%',
      // },

      width: {
        '1/10': '10%',
        '4/5': '80%',
      },
    },
  },
  plugins: [],
};
