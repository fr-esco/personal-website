// Regenerates the optimized, cache-busted profile/social images from a source photo.
//
// Usage:  node scripts/generate-avatar.mjs <source-image> [version]
// Example: node scripts/generate-avatar.mjs ~/photo.jpg v2   (run from apps/personal-website)
//
// Requires `sharp` (devDependency). Outputs into ./public:
//   profile-<size>-<version>.{webp,avif}  — the <picture> avatar (320 = 2x, 480 = 3x of a 160px box)
//   profile-og-<version>.jpg              — social/OG image (JPEG for scraper compatibility)
//
// After running, bump the version in:
//   - src/app/home.component.ts  (the <picture> block: -vN)
//   - src/app/app-seo.ts         (APP_IMAGE: profile-og-vN.jpg)
// The new filenames are a cache-bust: safe to serve with `immutable` (see firebase.json).

import sharp from 'sharp'
import { statSync } from 'node:fs'

const [src, version = 'v2'] = process.argv.slice(2)
if (!src) {
  console.error('Usage: node scripts/generate-avatar.mjs <source-image> [version]')
  process.exit(1)
}

const OUT = new URL('../public/', import.meta.url).pathname
const kb = (p) => (statSync(p).size / 1024).toFixed(1) + 'KB'

const { width, height } = await sharp(src).metadata()
const side = Math.min(width, height)
// Top-aligned square crop (subject framed at the top of a portrait source).
// Change `top` if the subject is centered/bottom.
const square = () => sharp(src).extract({ left: 0, top: 0, width: side, height: side })

for (const size of [320, 480]) {
  const webp = `${OUT}profile-${size}-${version}.webp`
  const avif = `${OUT}profile-${size}-${version}.avif`
  await square().resize(size, size).webp({ quality: 82 }).toFile(webp)
  await square().resize(size, size).avif({ quality: 58 }).toFile(avif)
  console.log(`profile-${size}-${version}: webp ${kb(webp)}, avif ${kb(avif)}`)
}

const og = `${OUT}profile-og-${version}.jpg`
await square().resize(1200, 1200).jpeg({ quality: 85, mozjpeg: true }).toFile(og)
console.log(`profile-og-${version}.jpg: ${kb(og)}`)

console.log(`\nDone. Now bump "-${version}" in home.component.ts and app-seo.ts, then rebuild.`)
