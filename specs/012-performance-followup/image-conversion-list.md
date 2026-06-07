# Local Static Image Inventory — >50 KB

**Date**: 2026-06-07
**Directories scanned**: `public/images/`, `assets/images/`
**Threshold**: >50 KB

---

## `public/images/` — Large Images

| File | Size | Current Format | Action |
|------|------|----------------|--------|
| `test-video.mp4` | 4.0 MB | MP4 | Keep (video, not image) |
| `realLocation.svg` | 326 KB | SVG | Keep (vector, already optimal) |
| `map.webp` | 322 KB | WebP | ✅ Already WebP; keep |
| `certified-logo.webp` | 132 KB | WebP | ✅ Already WebP; keep |
| `certified_footer_white.webp` | 100 KB | WebP | ✅ Already WebP; keep |
| `sky.png` | 98 KB | PNG | 🔄 Convert to WebP |
| `tour.webp` | 95 KB | WebP | ✅ Already WebP; keep |
| `bird.png` | 77 KB | PNG | 🔄 Convert to WebP |
| `flower.png` | 74 KB | PNG | 🔄 Convert to WebP |
| `youtubeone.png` | 73 KB | PNG | 🔄 Convert to WebP |
| `logo.png` | 72 KB | PNG | 🔄 Convert to WebP |
| `IMG_3817.jpg` | 69 KB | JPG | 🔄 Convert to WebP |
| `easter-egg.png` | 69 KB | PNG | 🔄 Convert to WebP |
| `Artboard` | 66 KB | Unknown | Investigate format |
| `team/contactusHero.png` | 63 KB | PNG | 🔄 Convert to WebP |
| `map-location-2.png` | 61 KB | PNG | 🔄 Convert to WebP |
| `certified.webp` | 54 KB | WebP | ✅ Already WebP; keep |
| `authHero.webp` | 53 KB | WebP | ✅ Already WebP; keep |

**PNG/JPG candidates for WebP conversion**: `sky.png`, `bird.png`, `flower.png`, `youtubeone.png`, `logo.png`, `IMG_3817.jpg`, `easter-egg.png`, `team/contactusHero.png`, `map-location-2.png`, `Artboard` (pending format check).

---

## `assets/images/` — Large Images

No images >50 KB found in `assets/images/`.

---

## Summary

- **Total large files scanned**: ~19
- **Already WebP**: 6
- **SVG (keep)**: 1
- **Video (keep)**: 1
- **Candidates for conversion**: ~10

Next step: Batch-convert PNG/JPG candidates to WebP at quality 80 (Tasks T016–T017).
