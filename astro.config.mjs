import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://viandalucia.org',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },
});
