// Tailwind v4: the plugin is @tailwindcss/postcss. Do NOT add `tailwindcss`
// to postcss.config — that is the v3 syntax and silently fails here.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
