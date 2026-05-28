import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconsDir = join(root, "public", "icons");
const svgPath = join(iconsDir, "icon.svg");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("[pwa-icons] sharp not installed; skipping PNG generation. Run: npm install -D sharp && npm run generate:icons");
    return;
  }

  if (!existsSync(svgPath)) {
    throw new Error(`Missing ${svgPath}`);
  }

  mkdirSync(iconsDir, { recursive: true });
  const svg = readFileSync(svgPath);

  const sizes = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "icon-maskable-512.png", size: 512, maskable: true }
  ];

  for (const { name, size, maskable } of sizes) {
    const pipeline = sharp(svg).resize(size, size);
    if (maskable) {
      const padding = Math.round(size * 0.1);
      const inner = size - padding * 2;
      const innerPng = await sharp(svg).resize(inner, inner).png().toBuffer();
      const canvas = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 10, g: 21, b: 5, alpha: 1 }
        }
      })
        .composite([{ input: innerPng, top: padding, left: padding }])
        .png()
        .toBuffer();
      writeFileSync(join(iconsDir, name), canvas);
    } else {
      writeFileSync(join(iconsDir, name), await pipeline.png().toBuffer());
    }
    console.log(`[pwa-icons] wrote ${name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
