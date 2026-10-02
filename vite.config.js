import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// One HTML file per page at the project root (multi-page site); ro/ holds the Romanian twin of each.
const pages = ["index", "services", "process", "team", "contact", "how-you-sell"];

// Production serves /ro as ro/index.html (the geo redirect and the canonical URL point at it); do the same in dev and preview.
const roHome = (server) => {
  server.middlewares.use((req, _res, next) => {
    if (/^\/ro(\?|$)/.test(req.url)) req.url = "/ro/index.html" + req.url.slice(3);
    next();
  });
};

export default defineConfig({
  plugins: [react(), tailwindcss(), { name: "ro-home", configureServer: roHome, configurePreviewServer: roHome }],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.flatMap((p) => [[p, `${p}.html`], [`ro/${p}`, `ro/${p}.html`]])),
      // Libraries get their own chunk, so editing a component no longer changes the hash of ~110 KB of library code
      // that returning visitors already cache (vercel.json serves hashed assets as immutable).
      output: {
        codeSplitting: {
          groups: [{ name: "vendor", test: /node_modules[\\/](react|react-dom|scheduler|framer-motion|motion-dom|motion-utils|tailwind-merge)[\\/]/ }],
        },
      },
    },
  },
});
