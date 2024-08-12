/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                main: ["Roboto", "sans-serif"],
            },
            backgroundColor: {
                "light-bg": "#eff4f6",
                "dark-bg": "#191c24",
                "light-bg-sec": "#ffffff",
                "dark-bg-sec": "#22252f",
            },
        },
    },
    plugins: [],
};
