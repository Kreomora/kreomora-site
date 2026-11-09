# KREOMORA — launch quality pass, 2026-11-09

The existing Next.js/Payload project, RU/EN routes, project IDs and original media are preserved. Changes are local; no hosted deployment was made.

## Contacts and content

- Old Telegram: no `@flexiG1` references remain in public source/UI.
- Source of truth: `data/contact.ts` — https://t.me/KreomoraX, kreomora@mail.ru, https://vk.ru/club243109699.
- Telegram is primary in division heroes, mobile menu/footer, Contact, StoryExplorer contact states and closing CTA sections on Home, STUDIO, MULTSTORY, About and all cases.
- Email is secondary in closing groups and Contact; footer also exposes the address. Subjects remain specific to general/STUDIO/MULTSTORY inquiries.
- VK is tertiary in Contact, footer and closing CTA groups. Telegram/VK use target=_blank and rel=noopener noreferrer.
- Header НАПИСАТЬ/CONTACT opens the contact page.
- Public form and unused submission helper removed. Admin editing forms remain intact.
- No analytics/tracking implementation detected in app/components/data/lib/config: Google Analytics/GTM, Yandex Metrika, Meta pixel, Hotjar, PostHog, Mixpanel and Plausible absent. No cookie banner added.
- Necessary cookies: kreomora-locale stores chosen language for one year (HttpOnly, SameSite=Lax, Secure on HTTPS); Payload authentication is for CMS sessions. No advertising cookies added.
- Ten bilingual STUDIO services: Commercial films; Motion design; Social content; Concerts & events; Live show visuals; Branding & campaigns; Product visuals; Mascots & characters; Sports visuals; Experimental visuals.
- About: independent studio introduction; creating complete visual worlds; STUDIO commercial work with mascot; MULTSTORY personal films with mascot; Two worlds / One creative language; contact CTA.

## Video

- Audited 18 original films: all 18 have a shortest dimension of at least 1080. Below 1080: none.
- Created 18 full-quality faststart web films, 18 native-resolution silent card clips, 18 posters and 54 stills.
- All current sources are compatible H.264, so the full films use lossless remuxing rather than recompression. Encoded video-stream SHA256 hashes match the original for all 18 files.
- Portrait/square posters remain 1080 pixels wide; landscape posters are 1920 pixels wide. No artificial enlargement.
- Heroes use full films; cards use HQ clips with hover playback; offscreen videos preload none. Full players use contain and retain original proportions.
- Original masters and previous proxies remain archived. Published projects reference HQ files served through Payload.
- Source formats: 12 landscape MULTSTORY, four portrait STUDIO, two square STUDIO. No vertical MULTSTORY source was supplied, so that exact requested sample cannot be tested.
- Full details: VIDEO_QUALITY_REPORT.md; machine-readable audit: data/video-quality.json.

## Verification results

- TypeScript: pass. ESLint: pass. Production build: pass.
- HTTP/localization checks: all 50 public RU/EN pages pass; official Telegram/VK links and safe target attributes, 98 email links/subjects, absence of public form fields, HQ case references, language cookies, canonical language alternates, 404 and admin route checked.
- CMS: authentication, CRUD, draft isolation/revision, publishing/unpublishing, ordering, reserved slugs, private uploads and publication validation pass. Disposable test records cleaned by the test script.
- All 18 real CMS projects retain bilingual fields and shared media IDs between locales.
- Browser checks at 1440 and 390 pixels: contact hierarchy, button sizing, About, STUDIO services, MULTSTORY hero and mobile menu. No horizontal overflow on the inspected mobile pages.
- Browser intrinsic video sizes confirmed: NOIR//VOID 1080×1080, СМАЧНО! Food 1080×1920, 3D Story 1920×1080. Full 3D Story player started successfully, preserving composition; offscreen hero paused.
- External contact hrefs checked without sending messages. Email application behavior depends on the visitor's device.

## Deployment actions remaining

Set the final NEXT_PUBLIC_SITE_URL and deploy the Node server with persistent SQLite/media storage; back up both together. Verify production years and neutral STUDIO EXPERIMENT project titles if desired. Local CMS has no email adapter, so production password-recovery email requires configuring one if needed. None of these prevents using the current direct contact links.
