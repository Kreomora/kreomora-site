# KREOMORA

Public Next.js 16 portfolio: 6 STUDIO projects and 12 MULTSTORY projects, in Russian and English. Production has no Payload initialization, admin routes, CMS API or database dependency.

## Development and Netlify

Use Node 22.23.4 or a supported newer version from package.json. Download existing public video objects with `git lfs pull` when cloning.

```sh
npm ci
npm run dev
# Production / Netlify:
npm run build
node scripts/serve-pages.mjs --netlify
```

Netlify runs `npm run build` and publishes `.netlify-build/out` at the domain root. `netlify.toml` sets both values and skips the Next.js runtime plugin. The build retrieves the referenced Git LFS videos on Netlify. No CMS or database is required. Set `NEXT_PUBLIC_SITE_URL` to override the default Netlify domain in page metadata. GitHub Pages keeps its own build and URL prefix.

## Public content and routes

`data/portfolio.json` contains public published content for all 18 projects in both languages. `lib/projects.ts` reads this file. Ordering, translations, full-quality films, silent high-quality card clips and posters in `public/portfolio/web/` are preserved. No video has been recompressed or removed.

Existing `/ru` and `/en` routes, language cookies and unprefixed redirects are preserved: home, studio, studio/work, studio/[slug], multstory, multstory/stories, multstory/[slug], about and contact. `/admin` and `/api/projects` return 404.

Contacts remain in `data/contact.ts` and `lib/contact.ts`, including Telegram drafts and email subjects/bodies.

## Archived CMS

Collections, configuration, scripts, types and ignored local storage are retained. Former Next routes are archived in `cms/archived-app/`, outside Next routing. The original loader and Next configuration are in `cms/archived-projects.ts` and `cms/next.config.ts`. Payload packages are development-only dependencies for archived tooling; public imports and production deployment traces must not include them.

`cms/LEGACY_CMS_README.md` is historical documentation, not current production setup. CMS CLI commands are optional legacy tools, not build prerequisites. Restoring an admin server requires explicitly restoring its route/config integration.

To export from a separately running legacy CMS, `npm run export:portfolio-content` reads only public published records and validates public media files. Review and commit the resulting snapshot. Production never calls this exporter.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
node scripts/test-pages.mjs --netlify
npm run build:server
npm run test:production
# With npm start running:
npm run test:i18n
```

`test:production` checks the route manifest, deployment traces, content/media paths and actual MP4 headers. `test:i18n` checks all 50 localized public pages and verifies admin/API routes are absent. The separate Pages workflow and its limitations are documented in `PAGES_DEPLOY.md`.
