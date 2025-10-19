/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // veya 'media' veya false
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./modal/**/*.{js,ts,jsx,tsx,mdx}",
    // Projenizin yapısına göre stil kullandığınız başka ana klasörler varsa
    // onları da buraya ekleyebilirsiniz. Örneğin:
    // "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
