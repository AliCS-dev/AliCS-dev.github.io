# Engineer's Atlas V3

Ali's engineering portfolio, built as a static Astro site with strict TypeScript,
native CSS, and typed Markdown content collections.

Production remains at [alics-dev.github.io](https://alics-dev.github.io/). The
redesign is under development on a feature branch and must not be deployed
without explicit approval.

## Requirements

- Node.js 24 or newer
- npm 11 or newer

## Local development

```sh
npm install
npm run dev
```

Astro serves the local site at `http://localhost:4321` by default.

## Validation

```sh
npm run validate
```

This runs Astro's TypeScript and content checks before producing the static
site in `dist/`.

## Source structure

```text
src/
  components/       Reusable interface components
  content/projects/ Verified project case studies in Markdown
  layouts/          Shared document and page layouts
  pages/            File-based routes
  styles/           Global design tokens and shared CSS
```

Legacy files remain in the repository during migration so existing content and
assets can be checked before they are moved or retired.
