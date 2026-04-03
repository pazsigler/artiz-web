#!/usr/bin/env node

/**
 * Convert all PNG/JPG/JPEG images in the public folder to WebP.
 * Usage: node scripts/convert-to-webp.mjs [--delete] [--quality 80] [--dir public]
 *
 * --delete   Remove original files after conversion
 * --quality  WebP quality (1-100, default 80)
 * --dir      Directory to scan (default: public)
 */

import sharp from "sharp";
import { readdir, stat, unlink } from "fs/promises";
import { join, extname, basename } from "path";

const args = process.argv.slice(2);
const shouldDelete = args.includes("--delete");
const qualityIdx = args.indexOf("--quality");
const quality = qualityIdx !== -1 ? parseInt(args[qualityIdx + 1], 10) : 80;
const dirIdx = args.indexOf("--dir");
const targetDir = dirIdx !== -1 ? args[dirIdx + 1] : "public";

const EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

let converted = 0;
let skipped = 0;
let totalSaved = 0;

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else if (EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      await convertFile(fullPath);
    }
  }
}

async function convertFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");

  try {
    // Check if webp already exists
    try {
      await stat(webpPath);
      console.log(`⏭  ${basename(filePath)} → already exists, skipping`);
      skipped++;
      return;
    } catch {
      // File doesn't exist, proceed
    }

    const originalStat = await stat(filePath);
    const originalSize = originalStat.size;

    if (ext === ".png") {
      await sharp(filePath).webp({ quality, lossless: false }).toFile(webpPath);
    } else {
      await sharp(filePath).webp({ quality }).toFile(webpPath);
    }

    const newStat = await stat(webpPath);
    const saved = originalSize - newStat.size;
    const pct = ((saved / originalSize) * 100).toFixed(1);
    totalSaved += saved;

    console.log(
      `✅ ${basename(filePath)} → ${basename(webpPath)} (${formatBytes(originalSize)} → ${formatBytes(newStat.size)}, -${pct}%)`
    );
    converted++;

    if (shouldDelete) {
      await unlink(filePath);
      console.log(`   🗑  deleted ${basename(filePath)}`);
    }
  } catch (err) {
    console.error(`❌ ${basename(filePath)}: ${err.message}`);
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

console.log(`\n🖼  Converting images to WebP (quality: ${quality})...`);
console.log(`📁 Scanning: ${targetDir}`);
if (shouldDelete) console.log(`⚠️  Original files will be deleted after conversion\n`);
else console.log(`ℹ️  Original files will be kept (use --delete to remove)\n`);

await walkDir(targetDir);

console.log(`\n--- Done ---`);
console.log(`Converted: ${converted}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total saved: ${formatBytes(totalSaved)}`);
