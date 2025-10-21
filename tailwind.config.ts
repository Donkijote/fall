import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    screens: {
      "3xl": "120rem",
      ...defaultTheme.screens,
    },
  },
};
