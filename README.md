# KREOMORA

Next.js 16 + Payload CMS 3 + SQLite. Real portfolio: 6 STUDIO films and 12 MULTSTORY films.

## Start

When cloning this repository, install Git LFS and run `git lfs pull` to download the public portfolio videos. Git stores these videos as LFS objects; all other public assets remain ordinary source files. Local `.env`, SQLite databases, backups, CMS uploads and administrator credentials are intentionally excluded. Set up fresh local credentials and import the public portfolio into CMS; never copy private storage into Git.

```sh
npm install
npm run cms:setup
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/admin. Existing local accounts are preserved. To create your own administrator run `npm run cms:admin` and enter your email, name and password in the terminal.

## Media and CMS import

Original files in Downloads are read/copied only, never moved or deleted.

- `public/brand/`: the three supplied brand originals, copied without modification.
- `public/portfolio/studio/` and `public/portfolio/multstory/`: full original films.
- `public/portfolio/previews/`: silent eight-second previews, about 0.4–2.4 MB each.
- `public/portfolio/posters/`: 18 posters and 54 film stills.
- `data/portfolio-import.json`: original filenames, public paths, titles, dimensions, duration and section.
- `PORTFOLIO_INVENTORY.md` and `PORTFOLIO_MEDIA_MAP.md`: import audit.
- `storage/kreomora.db` and `storage/media/`: live Payload data and uploaded media. Back these up together.

Prepare assets with `python scripts/prepare-portfolio.py` (set `FFMPEG_PATH` to an FFmpeg executable). Import with:

```sh
node --env-file=.env --import tsx scripts/import-portfolio.ts
```

The importer is repeatable, skips existing real projects and preserves legacy placeholders under archive slugs if they collide. Public queries exclude placeholders. Edit projects in `/admin/collections/projects`; publish to make changes visible. Media visibility must be public before project publication. Years default to 2026 as a catalog year; verify actual production dates in CMS.

## Routes

Public routes have `/ru` and `/en` prefixes: `/`, `/studio`, `/studio/work`, `/studio/[slug]`, `/multstory`, `/multstory/stories`, `/multstory/[slug]`, `/about`, `/contact`. Old unprefixed links redirect using the saved language (Russian by default). `/admin`, `/api`, `/sitemap.xml`, `/robots.txt` remain unprefixed. See `LOCALIZATION_GUIDE.md`.

## Before public launch

Set `NEXT_PUBLIC_SITE_URL` to the final domain. Official contacts are centralized in `data/contact.ts`: Telegram https://t.me/KreomoraX (primary), kreomora@mail.ru (secondary), VK https://vk.ru/club243109699 (tertiary). Public contact forms and mock submission code are removed. Telegram buttons open encoded drafts; email buttons include localized subjects and bodies. All five contexts and exact templates are documented in `CONTACT_DRAFTS.md`. Run `node --import tsx scripts/test-contact-drafts.ts` against the local server to verify them. Check project production years and neutral STUDIO EXPERIMENT 01/02 titles in CMS.

## Current high-quality video workflow

The original import's low-resolution previews remain archived. Published projects now use 18 full-resolution faststart films and 18 sharp card clips in `public/portfolio/web/`, plus native-resolution posters/stills. Hero and full-film references use the complete film, cards use the silent clip. All original files are retained.

```sh
python -m pip install imageio-ffmpeg
python scripts/optimize-portfolio.py
node --env-file=.env --import tsx scripts/import-video-quality.ts
```

The media importer updates media relationships only, preserving project IDs and localized content. Back up SQLite and media together before running. See `VIDEO_QUALITY_REPORT.md` for all 18 source audits and `LAUNCH_QA.md` for the final checklist.

## Validation and production

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

This is a server-backed application, not a static export. The old `out/` directory is not the current site. Hosting needs a Node server and persistent SQLite/media storage, or a suitable Payload database/storage deployment. No new hosted deployment was made by this local update.

## Bilingual content

UI dictionaries: `data/translations.ts`. Payload locales: Russian (default) and English. Localized fields: `displayTitle`, `summary`, `intro`, `seoDescription`, `categoryLabel`. Original fields and all media references are preserved. All 18 real projects have both translations; archived legacy placeholders are not translated or publicly shown.

Run `npm run cms:localize` after importing new copies of the supplied portfolio. The script fills missing translations without replacing edits. `npm run test:i18n` verifies 50 public pages and shared CMS media against the running local server.

New official mascot assets are in `public/brand/mascot/`. The transparent PNG is an unchanged copy; four WebP versions preserve source proportions.
