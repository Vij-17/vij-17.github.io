// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vij-17.github.io',
  // The site lives in a sub-folder named after the repository.
  // If you rename the repository to vij-17.github.io, delete this line and the site moves to the root address.
  base: '/SaiVijwalNulakajodu.github.io',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
