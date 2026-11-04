// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vij-17.github.io',
  // No `base` needed: the repository is named vij-17.github.io, so the site lives at the root address.
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
