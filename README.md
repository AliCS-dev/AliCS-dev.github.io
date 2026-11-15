# Engineer's Atlas V4

Ali's engineering portfolio, built as a static Astro site with strict TypeScript
and native CSS. The homepage opens with an interactive Engineering Atlas that
connects disciplines to projects and links to their case studies.

Production is hosted at [alics-dev.github.io](https://alics-dev.github.io/).

## Requirements

- Node.js 24 or newer
- npm 11 or newer

## Local development

```sh
npm ci
npm run dev
```

Astro serves the local site at `http://localhost:4321` by default.
Select a discipline or project in the homepage hero to inspect its connections.
On mobile, labeled HTML links replace the SVG controls. Without JavaScript, the
atlas links jump to the corresponding summaries and case-study links.

## Validation

```sh
npm run validate
```

This runs Astro's TypeScript and content checks before producing the static
site in `dist/`.

## Source structure

```text
src/
  components/v4/  Portfolio layout, homepage hero, project presentation, lab scene
  data/cases.ts   Verified case study content and evidence links
  scripts/        Progressive interaction and WebGL fallback
  pages/          Static homepage, projects, case studies, research and about
  styles/        Shared design tokens and V4 styles
```

The prior cinematic hero is retained in source. React Three Fiber and Three.js
remain in use on the isolated rendering study at `/lab/v4-canvas/`. The city,
drone, and architectural structures are conceptual. The MATLAB plot, Traffic
capture and Banking diagram are original project artifacts. The Mosaic-RAG
diagram is based on its API source.

## Production preview and GitHub Pages

Run `npm run validate` and then `npm run preview` to inspect `dist/` locally.
The [Astro Pages workflow](.github/workflows/pages.yml) validates pull requests
to `main` on Linux and publishes the built `dist/` artifact on pushes to `main`.
In the repository's Pages settings, the publishing source is GitHub Actions.
The lab route is included in the build for comparison and carries a noindex directive.

The homepage uses SVG, HTML and a lightweight controller. The optional lab
scene has a separate bundle and stays off the homepage request path.
