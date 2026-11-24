// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Canonical origin, used for the sitemap, robots.txt and Open Graph URLs.
// Defaults to the Cloudflare Pages address; set SITE_URL to override it.
const site = process.env.SITE_URL ?? "https://aunghtetpaing.pages.dev";

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "ignore",
  // Inline the (small) stylesheet so first paint needs no extra request.
  build: { inlineStylesheets: "always" },
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Bricolage Grotesque",
      cssVariable: "--font-bricolage",
      weights: [400, 600, 800],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      weights: [400, 500],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
