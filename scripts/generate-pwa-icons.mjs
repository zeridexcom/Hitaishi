// Generate PWA icons from public/hitaishi-logo.svg.
// Usage:
//   npm i -D sharp
//   node scripts/generate-pwa-icons.mjs
//
// This produces:
//   public/icon-192.png
//   public/icon-512.png
//   public/apple-touch-icon.png   (180x180, optional)
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "..", "public");
const svgPath = path.join(publicDir, "hitaishi-logo.svg");

const targets = [
  { out: "icon-192.png", size: 192 },
  { out: "icon-512.png", size: 512 },
  { out: "apple-touch-icon.png", size: 180 },
];

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch (e) {
    console.error("sharp is not installed. Run: npm i -D sharp");
    process.exit(1);
  }

  const svg = await fs.readFile(svgPath);
  for (const t of targets) {
    const out = path.join(publicDir, t.out);
    await sharp(svg, { density: 384 })
      .resize(t.size, t.size, { fit: "contain", background: { r: 11, g: 100, b: 69, alpha: 1 } })
      .png()
      .toFile(out);
    console.log(`wrote ${out} (${t.size}x${t.size})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
