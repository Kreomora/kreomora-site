# KREOMORA on GitHub Pages

URL: https://kreomora.github.io/kreomora-site/

## Build and publication

- Existing Next.js 16.4.5 / npm portfolio, same components, styles, text, contact drafts and ordering.
- `npm run build` remains the local Payload/SQLite server build. Local `npm run dev` still uses `/` on port 3000.
- `npm run build:pages` generates a disposable `.pages-build` workspace from the current frontend; Next `output: 'export'`, basePath/assetPrefix `/kreomora-site`, trailing slashes, unoptimized images.
- Static output: `.pages-build/out/`. No API, admin, database, proxy, server actions or runtime CMS in this build.
- Two statically specialized locale layouts replace request-header locale detection. Every one of the 18 published project slugs is generated for RU and EN. Root and old non-locale deep links redirect to the equivalent static RU path.
- `.github/workflows/deploy-pages.yml` installs dependencies, fetches real LFS files, builds, validates, uploads a Pages artifact and deploys with official GitHub actions. Pages Source is GitHub Actions.

## Content snapshot

`data/pages-projects.json` contains only publicly readable published content and media. To refresh after CMS edits: start the local CMS, run `npm run export:pages-content`, review the diff, build/test and commit. Drafts, users, credentials and private uploads are never exported. Local SQLite and CMS remain intact.

## Videos and size

The existing 72 LFS objects are preserved in Git. The export includes only the 18 full-resolution 1080 films plus their posters/stills and brand imagery. Cards reuse those films and loop the first eight seconds; this avoids 294,657,291 bytes of duplicate clips without re-encoding or downgrading quality. Original full-film bytes are copied unchanged.

Actions checkout uses `lfs: true`; the exporter rejects pointer text in place of a binary file. Uploading a prepared artifact containing real files avoids relying on Pages to resolve LFS pointers. Export validation enforces a conservative 1,000,000,000-byte limit. Reference: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Verification

`npm run test:pages` checks all 50 localized pages, internal links, scripts/styles/images, prefixes, prepared contacts and MP4 headers. `node scripts/serve-pages.mjs` serves the export at http://127.0.0.1:4173/kreomora-site/ with byte-range video support. Direct project URLs have index.html files and work after refresh.

This is a static shareable portfolio snapshot. Browser language switching works; server language cookies and editing through /admin belong to the local/server version. Publishing CMS edits requires updating the snapshot and pushing again. GitHub's Pages size/bandwidth limits still apply.
