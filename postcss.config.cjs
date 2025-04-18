/** @type {import('postcss').Config} */
module.exports = {
  plugins: [
    require('tailwindcss'),   //  ✔  CJS require
    require('autoprefixer'),
  ],
};
