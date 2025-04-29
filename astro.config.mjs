import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import node from "@astrojs/node";

import purgecss from "astro-purgecss";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), purgecss(), compress()],

  adapter: node({
    mode: "standalone"
  })
});