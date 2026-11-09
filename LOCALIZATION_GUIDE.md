# KREOMORA — localization and identity update

## Routing and language preference

`proxy.ts` rewrites `/ru/...` and `/en/...` to the existing frontend route handlers. This preserves the established Next.js route groups and Payload routes. Server rendering reads the injected locale header; no browser-side machine translation is used. The header is overwritten by the proxy rather than trusted from client input.

Unprefixed public URLs redirect to the saved `kreomora-locale` cookie, defaulting to `ru`. The cookie lasts one year, is HttpOnly/SameSite=Lax, and is Secure on HTTPS. Prefetch requests do not overwrite language preferences. RU/EN switches use a full navigation to the equivalent path, updating the HTML language and cookie. There is no IP detection.

Both locales expose:

- `/{locale}/`
- `/{locale}/studio/`, `/{locale}/studio/work/`, `/{locale}/studio/{slug}/`
- `/{locale}/multstory/`, `/{locale}/multstory/stories/`, `/{locale}/multstory/{slug}/`
- `/{locale}/about/`, `/{locale}/contact/`

`/admin`, `/api`, `/sitemap.xml`, `/robots.txt`, uploads and static assets are excluded from locale rewriting. Sitemap contains both languages. Canonicals, hreflang and Open Graph locale are emitted for public pages.

## Text and CMS

- `data/translations.ts`: complete RU/EN UI dictionary, navigation, CTA wording, services and mascot alt text.
- `data/project-translations.ts`: source translations for the 18 supplied projects.
- `lib/i18n.ts`: locale retrieval and localized metadata.
- `cms/collections/Projects.ts`: new optional localized fields `displayTitle`, `summary`, `intro`, `seoDescription`, `categoryLabel`.
- `payload.config.ts`: native Payload locales `ru` (default) and `en`, with fallback enabled.

Existing `title`, `description`, `subtitle`, category arrays and services remain intact as legacy fallback. IDs, slugs, section, year, display order and every media relationship are shared between languages. No images or videos were duplicated for translation. Public cards use `displayTitle` and `categoryLabel`; cases use localized intro; SEO uses `seoDescription`.

All five fields are filled in both languages for all 18 public projects. No public translation is pending. Descriptions are deliberately neutral; more detailed project narratives may be edited in CMS. Ten pre-existing placeholder records are retained but hidden from the public website and left untranslated.

Backup before schema update: `storage/backups/before-localization-2026-11-09.db`. Development schema sync added localized tables; production uses the existing SQLite database. When deploying to a different database, apply the corresponding schema migration/import before running with `NODE_ENV=production`; do not discard storage or run destructive schema reset commands.

`npm run cms:localize` fills only missing localized text. CMS editors choose RU or EN in the admin locale selector and publish their edits. Media visibility/publication rules are unchanged.

## One contact system

`data/contact.ts` is the source of truth for Telegram (@KreomoraX), email (kreomora@mail.ru) and VK (club243109699). `components/contact-link.tsx` provides bilingual, keyboard-accessible primary Telegram, secondary email and tertiary VK links. External links use a new tab with noopener/noreferrer. `lib/contact.ts` centralizes all RU/EN drafts and exposes getContactMessage, getTelegramUrl and getEmailUrl. Both subject and body are encoded; case Telegram messages include the localized title. See CONTACT_DRAFTS.md for every template and client-testing limitations.

Contact groups appear at the end of the home, STUDIO, MULTSTORY, About and project pages; Telegram also appears in division heroes, the mobile menu and footer. Contact has three large stacked buttons. Header Contact/НАПИСАТЬ opens the contact page. The public form and unused submission helper are deleted; CMS forms are preserved.

Only the necessary language-preference cookie and Payload admin authentication are used. No analytics, advertising pixels, session replay or cookie banner is installed.

## Official mascot assets

All images are copied/optimized from user-supplied originals without redesign, recoloring or cropping.

| Asset in public/brand/mascot | Placement | Aspect |
|---|---|---|
| mascot-transparent.png | About character section | 1122×1402, alpha verified |
| mascot-home-hero.webp | Homepage brand introduction after selected work | 1672×941 |
| mascot-studio.webp | Home STUDIO teaser and STUDIO capabilities introduction | 1672×941 |
| mascot-multstory.webp | Home MULTSTORY teaser, memory section, service contact states | 1672×941 |
| mascot-portrait.webp | Contact, next to the contact buttons | 1122×1402 |

`components/mascot.tsx` sets intrinsic sizes, responsive sizes and lazy loading. Desktop home typography occupies left negative space; memory-section typography occupies right negative space. On mobile, native-ratio images and text stack, keeping heads/horns/shoes intact. The portrait retains its portrait ratio.

STUDIO uses graphite/black, high-contrast typography and green accents. MULTSTORY uses warm forest black, ivory and muted gold, with emotional imagery. Real project videos remain above brand imagery.

## Verification

`npm run typecheck`, `npm run lint`, `npm run build`.

With `npm run dev` running: `npm run test:i18n` checks 50 RU/EN pages, official contact links, cookie defaults/preferences, hreflang, 404, admin availability, localized CMS fields and identical media IDs across locales.

Browser checks cover 1440px and 390px, equivalent-page switches, refresh persistence, navigation, muted previews, contact links and button sizing and mascot ratios. Mailto URL targets/subjects are verified; external mail-client launch depends on the visitor's system configuration, and no test email is sent.
