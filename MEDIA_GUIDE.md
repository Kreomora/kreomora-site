# Media replacement guide

All current `.svg` files are intentionally abstract placeholders generated locally. Replace them with your finished work, then update `data/projects.ts` and set `placeholder: false`. You can retain SVGs as fallbacks until the new files are ready.

## Project directories

| Direction | Directory in `public/media/` |
|---|---|
| STUDIO — KLYRO ONE | `studio/klyro-one/` |
| STUDIO — СМАЧНО! | `studio/smachno/` |
| STUDIO — NOIR//VOID | `studio/noir-void/` |
| STUDIO — GALCHINO FC | `studio/galchino-fc/` |
| STUDIO — STYLE LAB | `studio/style-lab/` |
| MULTSTORY — A Random Ride | `multstory/random-ride/` |
| MULTSTORY — Two of Us | `multstory/two-of-us/` |
| MULTSTORY — Winter Memory | `multstory/winter-memory/` |
| MULTSTORY — Our First Trip | `multstory/our-first-trip/` |
| MULTSTORY — For Mom | `multstory/for-mom/` |

## Expected files in every directory

| File | Purpose | Format / ratio |
|---|---|---|
| `cover.webp` | Grid, hero poster, social preview | 1600–2400 px wide, 16:9; keep subject crop-safe for portrait cards |
| `cover.mp4` | Optional short card loop | H.264, 16:9, muted, 4–8 s, ideally below 3 MB |
| `hero.mp4` | Main film / fullscreen player | H.264 + AAC, 1920×1080, 16:9 |
| `frame-01.webp` | World/product image | 1600 px+, 4:3; centered subject |
| `frame-02.webp` | Details/style image | 1600 px+, 4:5; centered subject |

Current equivalents are `cover.svg`, `frame-01.svg`, `frame-02.svg`. These files exist in every directory. `ASSETS.txt` is a quick local reminder. Gallery arrays can be extended in the data model; extend the case layout if you need additional specialized blocks.

Example for KLYRO ONE: set `cover: '/media/studio/klyro-one/cover.webp'`, `coverVideo: '/media/studio/klyro-one/cover.mp4'`, `heroVideo: '/media/studio/klyro-one/hero.mp4'`, and replace gallery paths. URLs omit the `public` prefix.

## Home and showreel

- `public/media/home/multstory.svg`: warm hero poster; replace with a crop-safe 16:9 WebP.
- `public/media/home/studio.svg`: commercial hero poster; replace with a crop-safe 16:9 WebP.
- Add `public/media/home/multstory.mp4` and `studio.mp4`, then pass their paths as `src` to the relevant `MediaVideo` instances in `app/page.tsx`, `app/multstory/page.tsx` and `app/studio/page.tsx`.
- Add `public/media/studio/showreel.mp4`; pass it to the Studio `Reel` component. Until then, the reel control opens a clearly labeled preview rather than claiming to play an absent film.
- World panels and project cards use the corresponding project's cover and coverVideo.
- Replace `public/og.svg` with a 1200×630 JPEG/PNG and update metadata in `app/layout.tsx`. SVG social previews are placeholders; many crawlers require a raster image. Replace `public/icon.svg` with the final favicon.

## Before public launch

Replace temporary descriptions and all artwork; add verified credits if desired. Connect `lib/inquiry.ts` to a real endpoint with server-side validation and spam protection. Add verified social URLs in `data/site.ts` and render them as links in the footer. Set the final canonical URL. Check all replacement videos on mobile, captions for meaningful audio, file sizes, crops and color contrast.
