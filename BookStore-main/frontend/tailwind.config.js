/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Outfit", "sans-serif"],
				serif: ["Lora", "Georgia", "serif"],
				display: ["Playfair Display", "Georgia", "serif"],
				cinzel: ["Cinzel", "serif"],
			},
			boxShadow: {
				book: "0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)",
				"book-spine":
					"inset 20px 0 30px -10px rgba(0,0,0,0.15), inset -20px 0 30px -10px rgba(0,0,0,0.15)",
			},
		},
	},
	plugins: [],
};
