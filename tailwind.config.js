// ./tailwind.config.js

module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
     darkMode: false,
     theme: {
       extend: {
         spacing: {
           13: '4.25rem',
           100: '100vh'
         }
       },
     },
     variants: {
       extend: {},
     },
     plugins: [],
}