# KREOMORA on GitHub Pages

URL: https://kreomora.github.io/kreomora-site/

## Build and publication

- Existing Next.js 16.4.5 / npm portfolio, same components, styles, text, contact drafts and ordering.
- `npm run build` is now the separate static Netlify export in `.netlify-build/out` using `data/portfolio.json`, without Payload or a database. Local `npm run dev` still uses `/` on port 3000. The former CMS routes/configuration are archived under `cms/`.
- `npm run build:pages` generates a disposable `.pages-build` workspace from the current frontend; Next `output: 'export'`, basePath/assetPrefix `/kreomora-site`, trailing slashes, unoptimized images.
- Static output: `.pages-build/out/`. No API, admin, database, proxy, server actions or runtime CMS in this build.
- Two statically specialized locale layouts replace request-header locale detection. Every one of the 18 published project slugs is generated for RU and EN. Root and old non-locale deep links redirect to the equivalent static RU path.
- `.github/workflows/deploy-pages.yml` installs dependencies, fetches real LFS files, builds, validates, uploads a Pages artifact and deploys with official GitHub actions. Pages Source is GitHub Actions.

## Content snapshot

`data/pages-projects.json` contains only publicly readable published content and media. To refresh from a separately restored legacy CMS server, run `npm run export:pages-content`, review the diff, build/test and commit. Drafts, users, credentials and private uploads are never exported. Local SQLite files and archived CMS sources remain intact; the default app no longer exposes an admin server.

## Videos and size

The existing 72 LFS objects are preserved in Git. The export includes only the 18 full-resolution 1080 films plus their posters/stills and brand imagery. Cards reuse those films and loop the first eight seconds; this avoids 294,657,291 bytes of duplicate clips without re-encoding or downgrading quality. Original full-film bytes are copied unchanged.

Actions checkout uses `lfs: true`; the exporter rejects pointer text in place of a binary file. Uploading a prepared artifact containing real files avoids relying on Pages to resolve LFS pointers. Export validation enforces a conservative 1,000,000,000-byte limit. Reference: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Verification

`npm run test:pages` checks all 50 localized pages, internal links, scripts/styles/images, prefixes, prepared contacts and MP4 headers. `node scripts/serve-pages.mjs` serves the export at http://127.0.0.1:4173/kreomora-site/ with byte-range video support. Direct project URLs have index.html files and work after refresh.

This is a static shareable portfolio snapshot. Browser language switching works; server language cookies and editing through /admin belong to the local/server version. Publishing CMS edits requires updating the snapshot and pushing again. GitHub's Pages size/bandwidth limits still apply.

## Publication attempt — 2026-11-10

Local `npm ci`, the original server build, lint, static build and static tests passed. The export is 742,643,711 bytes across 439 files (largest file 55,936,910 bytes). Local HTTP checks passed for 184 pages/assets; localhost and local /admin both returned 200.

GitHub Actions build/test/artifact upload succeeded twice, but Pages publication did not finish. Runs 42806624938 and 42808441109 stayed at `syncing_files` and were canceled at the deployment timeout. `actions/deploy-pages@v5.0.1` clamps its timeout to 600,000 ms; increasing the input does not extend this limit. The ineffective timeout input was removed. The public URL returned 404, so the site is NOT verified as published. GitHub reported no more specific synchronization error; artifact size is not proven to be the cause.

A practical alternative is to serve the 18 unchanged full-quality MP4 files (723,204,675 bytes) from public object storage/CDN with video byte-range support, keeping approximately 19.4 MB of HTML/CSS/JS/images on Pages. No media were deleted, migrated, downscaled or replaced. This alternative is not implemented; it requires an actual storage destination. Another option is a static hosting provider able to deploy the complete 742.6 MB artifact. Local Payload remains available.
