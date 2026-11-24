import { cardDecks } from "@/domain/artwork/decks";
import { createDeck } from "@/domain/rules/deck";

import { getCardBackUrl, getCardFaceUrl, getCardFaceUrls } from "./cardArtwork";

test("each visual pack covers the authoritative 40 faces with a separate shared back", () => {
  const allUrls = new Set<string>();
  for (const { id } of cardDecks) {
    const urls = getCardFaceUrls(id);
    expect(urls).toHaveLength(createDeck().length);
    expect(urls.every(Boolean)).toBe(true);
    expect(new Set(urls).size).toBe(40);
    const back = getCardBackUrl(id);
    expect(back).toBeTruthy();
    expect(urls).not.toContain(back);
    [...urls, back].forEach((url) => allUrls.add(url));
    for (const { suit, rank } of createDeck())
      expect(urls).toContain(getCardFaceUrl(suit, rank, id));
  }
  expect(allUrls.size).toBe(123);
});
/// <reference types="node" />

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("every runtime card export matches its recorded provenance hash", () => {
  const manifest = JSON.parse(
    readFileSync(resolve("docs/design/card-deck/prompts.json"), "utf8"),
  ) as {
    outputs: { file: string; role?: string; sha256: string }[];
  };
  const exports = manifest.outputs.filter(({ role }) => role === "runtime-export");
  expect(exports).toHaveLength(cardDecks.length * (createDeck().length + 1));
  for (const entry of exports) {
    const file = resolve("docs/design/card-deck", entry.file);
    expect(createHash("sha256").update(readFileSync(file)).digest("hex")).toBe(entry.sha256);
  }
});
