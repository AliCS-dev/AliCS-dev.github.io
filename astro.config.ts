import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alics-dev.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
