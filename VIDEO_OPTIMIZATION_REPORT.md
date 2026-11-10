# Netlify video optimization

All sizes are decimal bytes. Originals remain in place. Netlify uses the separate copies under `public/portfolio/web/optimized/`.

- Original total: 1,017,861,966 bytes.
- Optimized total: 312,514,609 bytes (69.3% reduction).
- Largest: 3d-story-1080.mp4 (22,807,105 bytes).
- All 36 copies have their moov atom before mdat.
- H.264 / yuv420p / CRF 22 / medium. Original dimensions retained. Full films use AAC 128 kb/s where the source has audio. Previews are silent.
- Hero backgrounds reuse the existing short preview edits. Full-length films are available in the players.
- Existing JPEG posters are retained (average 136 KB, max 247 KB), avoiding another lossy encode.
- SSIM over the first 48 frames was 0.9911 for NOIR//VOID (square), 0.9910 for Smachno Food (portrait), and 0.9972 for 3D Story (landscape).

| File | Resolution | Codec | Duration (source → output) | Original bytes | Optimized bytes | Audio (source → output) | Netlify use |
|---|---|---|---|---:|---:|---|---|
| noir-void-card-hq.mp4 | 1080x1080 | h264 → h264 | 00:00:08.09 → 00:00:08.03 | 14,914,467 | 2,148,716 | no → no | Card, world panel and project hero, Home / Studio hero |
| noir-void-1080.mp4 | 1080x1080 | h264 → h264 | 00:00:20.09 → 00:00:20.09 | 28,629,050 | 5,798,086 | yes → yes | Full film, Studio reel |
| smachno-social-card-hq.mp4 | 1080x1080 | h264 → h264 | 00:00:08.09 → 00:00:08.03 | 15,694,141 | 1,964,303 | no → no | Card, world panel and project hero |
| smachno-social-1080.mp4 | 1080x1080 | h264 → h264 | 00:00:20.09 → 00:00:20.09 | 29,554,607 | 5,526,326 | yes → yes | Full film |
| smachno-food-card-hq.mp4 | 1080x1920 | h264 → h264 | 00:00:08.04 → 00:00:08.03 | 15,182,762 | 4,078,027 | no → no | Card, world panel and project hero |
| smachno-food-1080.mp4 | 1080x1920 | h264 → h264 | 00:00:15.07 → 00:00:15.07 | 21,840,737 | 7,173,637 | yes → yes | Full film |
| smachno-delivery-card-hq.mp4 | 1080x1450 | h264 → h264 | 00:00:08.09 → 00:00:08.03 | 17,687,071 | 4,439,634 | no → no | Card, world panel and project hero |
| smachno-delivery-1080.mp4 | 1080x1450 | h264 → h264 | 00:00:17.86 → 00:00:17.86 | 25,488,348 | 7,572,895 | yes → yes | Full film |
| studio-experiment-01-card-hq.mp4 | 1080x1450 | h264 → h264 | 00:00:08.08 → 00:00:08.03 | 12,054,097 | 1,926,685 | no → no | Card, world panel and project hero |
| studio-experiment-01-1080.mp4 | 1080x1450 | h264 → h264 | 00:00:09.91 → 00:00:09.91 | 12,724,592 | 2,741,977 | yes → yes | Full film |
| studio-experiment-02-card-hq.mp4 | 1080x1450 | h264 → h264 | 00:00:08.04 → 00:00:08.03 | 11,415,223 | 2,141,264 | no → no | Card, world panel and project hero |
| studio-experiment-02-1080.mp4 | 1080x1450 | h264 → h264 | 00:00:11.08 → 00:00:11.08 | 14,042,889 | 3,046,531 | yes → yes | Full film |
| 3d-story-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.04 → 00:00:08.03 | 14,459,814 | 4,862,212 | no → no | Card, world panel and project hero |
| 3d-story-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:35.97 → 00:00:35.97 | 55,936,910 | 22,807,105 | yes → yes | Full film |
| cinematic-realism-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.06 → 00:00:08.03 | 21,027,545 | 5,158,753 | no → no | Card, world panel and project hero |
| cinematic-realism-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:30.07 → 00:00:30.07 | 47,911,343 | 21,096,858 | yes → yes | Full film |
| knitted-story-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.05 → 00:00:08.03 | 19,074,690 | 4,121,334 | no → no | Card, world panel and project hero |
| knitted-story-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:27.89 → 00:00:27.89 | 44,229,245 | 15,157,283 | yes → yes | Full film |
| clay-story-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.06 → 00:00:08.03 | 18,733,550 | 3,588,947 | no → no | Card, world panel and project hero |
| clay-story-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:30.07 → 00:00:30.07 | 45,379,375 | 12,310,080 | yes → yes | Full film |
| 2d-animation-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.04 → 00:00:08.03 | 11,446,976 | 3,813,233 | no → no | Card, world panel and project hero |
| 2d-animation-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:35.48 → 00:00:35.48 | 55,068,739 | 17,333,692 | yes → yes | Full film |
| anime-story-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.06 → 00:00:08.03 | 18,499,131 | 3,673,993 | no → no | Card, world panel and project hero |
| anime-story-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:30.07 → 00:00:30.07 | 47,670,907 | 14,856,028 | yes → yes | Full film |
| brick-world-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.04 → 00:00:08.03 | 20,768,382 | 5,772,186 | no → no | Card, world panel and project hero |
| brick-world-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:29.28 → 00:00:29.28 | 44,001,757 | 19,644,825 | yes → yes | Full film |
| gender-reveal-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.04 → 00:00:08.03 | 17,971,937 | 2,995,575 | no → no | Card, world panel and project hero |
| gender-reveal-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:31.97 → 00:00:31.97 | 51,414,265 | 19,696,048 | yes → yes | Full film |
| child-story-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.09 → 00:00:08.03 | 20,357,436 | 5,451,474 | no → no | Card, world panel and project hero |
| child-story-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:30.72 → 00:00:30.72 | 46,630,878 | 18,969,656 | yes → yes | Full film |
| family-story-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.08 → 00:00:08.03 | 14,858,884 | 3,953,293 | no → no | Card, world panel and project hero, Multstory hero |
| family-story-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:35.71 → 00:00:35.71 | 51,979,592 | 17,372,661 | yes → yes | Full film |
| love-story-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.05 → 00:00:08.03 | 12,274,234 | 2,653,367 | no → no | Card, world panel and project hero |
| love-story-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:35.02 → 00:00:35.02 | 52,978,573 | 17,350,650 | yes → yes | Full film |
| the-proposal-card-hq.mp4 | 1920x1080 | h264 → h264 | 00:00:08.06 → 00:00:08.03 | 18,236,951 | 3,810,238 | no → no | Card, world panel and project hero |
| the-proposal-1080.mp4 | 1920x1080 | h264 → h264 | 00:00:30.07 → 00:00:30.07 | 47,722,868 | 17,507,037 | yes → yes | Full film |
