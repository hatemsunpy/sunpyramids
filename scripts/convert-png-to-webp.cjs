const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const files = [
  'public/images/authHero.png',
  'public/images/map.png',
  'public/images/tour.png',
  'public/images/faqs-banner.png',
  'public/images/certified-logo.png',
  'public/images/certified.png',
  'public/images/certified_footer_white.png',
  'public/images/shorts.png',
  'public/images/tiktok.png',
  'public/images/cri-container.png',
  'public/images/instagram.png',
  'public/images/youtubetwo.png',
  'assets/imgs/wheelChair.png',
];

async function convert() {
  for (const file of files) {
    const input = path.resolve(file);
    const output = input.replace(/\.png$/, '.webp');
    if (!fs.existsSync(input)) {
      console.log(`SKIP (not found): ${file}`);
      continue;
    }
    try {
      await sharp(input).webp({ quality: 80 }).toFile(output);
      const inSize = fs.statSync(input).size;
      const outSize = fs.statSync(output).size;
      const reduction = ((1 - outSize / inSize) * 100).toFixed(1);
      console.log(`OK: ${file} → ${path.basename(output)} (${(inSize/1024).toFixed(1)}KB → ${(outSize/1024).toFixed(1)}KB, -${reduction}%)`);
    } catch (err) {
      console.error(`FAIL: ${file} — ${err.message}`);
    }
  }
}

convert();
