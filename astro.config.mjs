import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import node from "@astrojs/node";

import purgecss from "astro-purgecss";

import compress from "astro-compress";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), purgecss(), compress()],
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
