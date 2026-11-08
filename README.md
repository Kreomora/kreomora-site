# KREOMORA

Next.js App Router + React + TypeScript. Static export, no database or backend required.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. Node.js 22 recommended.

```sh
npm run lint
npm run typecheck
npm run build
```

The production website is exported to `out/`. Serve that folder with any static host that supports directory index.html files. `next start` is not used with static export.

## Routes

- `/` — two creative worlds
- `/studio`, `/studio/work`, `/studio/[slug]` — five commercial cases
- `/multstory`, `/multstory/stories`, `/multstory/[slug]` — five personal stories
- `/about`, `/contact`
- `/sitemap.xml`, `/robots.txt`, custom 404

## Content and configuration

- `data/projects.ts`: all project metadata, media, next-project navigation.
- `data/site.ts`: navigation, capabilities, social placeholders, canonical origin.
- `components/media.tsx`: lazy video playback, viewport pause, reduced motion, image fallback.
- `lib/inquiry.ts`: explicitly non-sending demo adapter. Connect a validated real endpoint before launch.
- `MEDIA_GUIDE.md`: asset inventory and replacement steps.

Set `NEXT_PUBLIC_SITE_URL` before building for your final domain. Replace the favicon and social preview. Social links are intentionally displayed as inactive text until verified URLs are supplied. No invented client credits or team claims are included.

The abstract artwork and personal-story descriptions are placeholders, not representations of finished client films. No MP4 is loaded until an actual path is configured. Use the real artwork and films to complete the production portfolio.

## Interaction and accessibility

Responsive editorial grids; desktop 50/50 to 58/42 hero; stacked mobile worlds; keyboard-visible focus; fullscreen mobile navigation with Escape; native video dialog; service selectors with touch and keyboard support; archive filters; native form validation and loading/demo-success states. Motion respects reduced-motion preferences. No scroll hijacking or heavyweight animation library.

The local CSS uses an open-source Manrope web font with system fallbacks. SVG placeholders are original local vector compositions. Production images can be pre-optimized WebP/AVIF because the static export has no image optimization server.
