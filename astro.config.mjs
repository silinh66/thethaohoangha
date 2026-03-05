// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

import prefetch from '@astrojs/prefetch';

// https://astro.build/config
export default defineConfig({
  site: 'https://thethaohoangha.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [partytown(), sitemap(), prefetch()]
});