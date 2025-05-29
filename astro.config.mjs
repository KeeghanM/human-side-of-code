import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import compress from "astro-compress";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

//Fix the unable to get local issuer certificate error
process.env.NODE_TLS_REJECT_UNAUTHORIZED =
  process.env.NODE_ENV === "development" ? "0" : "1";

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
