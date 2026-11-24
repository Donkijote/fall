/** Export complete generated cards. Only shared backs receive approved symmetry normalization. */
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

import { cardDecks } from "../src/domain/artwork/decks.ts";
import { createDeck } from "../src/domain/rules/deck.ts";

const tooling = process.argv[2];
if (!tooling) throw new Error("Pass the export tooling node_modules directory (sharp).");
const sharp = createRequire(join(resolve(tooling), "../package.json"))("sharp");
const manifestFile = resolve("docs/design/card-deck/prompts.json");
const manifestRoot = dirname(manifestFile);
const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
const masters = manifest.outputs.filter((entry) => entry.role === "card-master");
const hash = (data) => createHash("sha256").update(data).digest("hex");
const expected = createDeck().map(({ suit, rank }) => `${suit}-${rank}`);
const checking = process.argv.includes("--check");
const normalizeMasters = process.argv.includes("--normalize-backs");

// This is the only image edit: repeat the complete generated upper half by
// rotation. No ornament, paper, border, type or face artwork is reconstructed.
async function normalizeBack(bytes) {
  const { data, info } = await sharp(bytes)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const offset = (x, y) => (y * width + x) * 4;
  for (let y = 0; y < Math.floor(height / 2); y++) {
    for (let x = 0; x < width; x++) {
      const source = offset(x, y);
      data.copy(data, offset(width - 1 - x, height - 1 - y), source, source + 4);
    }
  }
  if (height % 2 === 1) {
    const middle = Math.floor(height / 2);
    for (let x = 0; x < Math.floor(width / 2); x++) {
      const source = offset(x, middle);
      data.copy(data, offset(width - 1 - x, middle), source, source + 4);
    }
  }
  return sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ lossless: true, effort: 5 })
    .toBuffer();
}

async function verifyBack(bytes, label) {
  const { data, info } = await sharp(bytes)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = info.width * info.height;
  for (let i = 0; i < pixels / 2; i++) {
    const opposite = pixels - 1 - i;
    if (data[i * 4 + 3] !== data[opposite * 4 + 3])
      throw new Error(`Back alpha differs after rotation: ${label}`);
    // RGB in fully transparent pixels has no rendered appearance.
    if (data[i * 4 + 3] === 0) continue;
    for (let channel = 0; channel < 3; channel++) {
      if (data[i * 4 + channel] !== data[opposite * 4 + channel])
        throw new Error(`Back differs after rotation: ${label}`);
    }
  }
}

for (const { id: pack } of cardDecks) {
  const entries = masters.filter((entry) => entry.pack === pack);
  const keys = entries.map((entry) => entry.card);
  if (
    keys.length !== expected.length + 1 ||
    new Set(keys).size !== keys.length ||
    [...expected, "back"].some((key) => !keys.includes(key))
  ) {
    throw new Error(`${pack} must have the authoritative 40 faces and one back.`);
  }
  for (const entry of entries) {
    const masterPath = resolve(manifestRoot, entry.file);
    let master = await readFile(masterPath);
    if (hash(master) !== entry.sha256)
      throw new Error(`Master changed without a provenance update: ${entry.file}`);
    if (!checking && normalizeMasters && entry.card === "back" && !entry.back_normalization) {
      master = await normalizeBack(master);
      await writeFile(masterPath, master);
      entry.sha256 = hash(master);
      entry.back_normalization = {
        approved_on: "2026-11-23",
        method:
          "Generated upper half repeated as a 180-degree-rotated lower half; original source generation hash retained.",
      };
      entry.notes +=
        " Back-only rotational normalization was explicitly approved by the user on 2026-11-23. No face artwork was altered.";
    }
    const target = resolve(manifestRoot, entry.runtime_file);
    const exportEntry = manifest.outputs.find((output) => output.file === entry.runtime_file);
    if (!exportEntry) throw new Error(`Missing export provenance: ${entry.runtime_file}`);
    if (!checking) {
      await mkdir(dirname(target), { recursive: true });
      let bytes;
      if (entry.card === "back") {
        const resized = await sharp(master)
          .resize({
            width: 504,
            height: 704,
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer();
        bytes = await normalizeBack(resized);
        exportEntry.notes =
          "Complete generated back with user-approved upper-half rotational normalization, repeated after aspect-preserving export to guarantee identical rendered pixels after a 180-degree turn. Lossless WebP. No new ornament or frame is introduced.";
      } else {
        bytes = await sharp(master)
          .resize({
            width: 504,
            height: 704,
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .webp({ quality: 92, alphaQuality: 100, effort: 5 })
          .toBuffer();
      }
      await writeFile(target, bytes);
      exportEntry.sha256 = hash(bytes);
    }
    const bytes = await readFile(target);
    const metadata = await sharp(bytes).metadata();
    if (metadata.width !== 504 || metadata.height !== 704 || hash(bytes) !== exportEntry.sha256) {
      throw new Error(`Invalid runtime export: ${entry.runtime_file}`);
    }
    if (entry.card === "back") {
      await verifyBack(master, entry.file);
      await verifyBack(bytes, entry.runtime_file);
    }
  }
}
if (!checking) await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `${checking ? "Verified" : "Exported"} 120 complete faces and three pixel-symmetric backs. Face artwork remains untouched.`,
);
