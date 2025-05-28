import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import compress from "astro-compress";
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://www.humansideofcode.org",
  integrations: [react(), sitemap(), compress()],
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
