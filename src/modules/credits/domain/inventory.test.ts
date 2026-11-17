/// <reference types="node" />

import { createHash } from "node:crypto";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { creditsInventory } from "./inventory";

test("every runtime asset has an inventory owner, including unresolved provenance", () => {
  const groups = [...creditsInventory.artwork, ...creditsInventory.icons];
  const covered = new Set(
    groups.flatMap((entry) => entry.files.flatMap((pattern) => globSync(pattern))),
  );
  const files = [...globSync("src/assets/**/*"), ...globSync("public/*")].filter((file) =>
    /\.(svg|png|webp|jpg|mp3|wav|ico)$/.test(file),
  );
  expect(files.filter((file) => !covered.has(file))).toEqual([]);
  expect(new Set(groups.map((entry) => entry.id)).size).toBe(groups.length);
  for (const entry of groups) {
    expect(entry.creator).toBeTruthy();
    expect(entry.evidence).toBeTruthy();
    expect(entry.notice).toBeTruthy();
    expect(entry.modifications).toBeTruthy();
    expect(new URL(entry.source).protocol).toBe("https:");
  }
});

test("retains the existing icon credits, full font notices and project MIT notice", () => {
  expect(creditsInventory.icons.map((entry) => entry.creator)).toEqual([
    "Lorc",
    "Delapouite",
    "Faithtoken",
    "Sbed",
    "Skoll",
  ]);
  for (const font of creditsInventory.fonts) {
    expect(font.notice).toContain("SIL OPEN FONT LICENSE");
    expect(font.notice).toContain("DISCLAIMER");
  }
  expect(creditsInventory.project.notice).toBe(readFileSync(resolve("LICENSE"), "utf8"));
});

test("software notices match the dependency lockfile and preserve special license terms", () => {
  expect(creditsInventory.software.lockfileSha256).toBe(
    createHash("sha256")
      .update(readFileSync(resolve("pnpm-lock.yaml")))
      .digest("hex"),
  );
  expect(
    creditsInventory.software.entries.find((entry) => entry.name === "react")?.notices[0].text,
  ).toContain("Copyright");
  expect(
    creditsInventory.software.entries.find((entry) => entry.name === "gsap")?.license,
  ).toContain("gsap.com/standard-license");
  expect(creditsInventory.software.entries.some((entry) => entry.name === "@babel/core")).toBe(
    false,
  );
  expect(creditsInventory.software.entries.some((entry) => entry.name === "@babel/runtime")).toBe(
    true,
  );
  expect(
    creditsInventory.software.entries.some((entry) => entry.name.startsWith("@radix-ui/")),
  ).toBe(false);
  expect(
    creditsInventory.software.entries.some((entry) => ["leva", "r3f-perf"].includes(entry.name)),
  ).toBe(false);
  expect(
    creditsInventory.software.entries.find((entry) => entry.name === "shadcn")?.notices.length,
  ).toBeGreaterThan(0);
});

test("every software notice is justified by bundled code or a distributed CSS import", () => {
  const software = creditsInventory.software;
  const shipped = [...software.bundledCode, ...software.distributedAssets].map(
    ({ name, version }) => `${name}@${version}`,
  );
  const listed = software.entries.flatMap(({ name, versions }) =>
    versions.map((version) => `${name}@${version}`),
  );
  expect([...new Set(listed)].sort()).toEqual([...new Set(shipped)].sort());
  for (const entry of software.entries) expect(entry.includedBy.length).toBeGreaterThan(0);
  expect(
    software.entries.filter(({ name }) =>
      ["camera-controls", "buffer", "base64-js", "bidi-js"].includes(name),
    ),
  ).toEqual([]);
  expect(software.distributedAssets.map(({ name }) => name).sort()).toEqual([
    "shadcn",
    "tailwindcss",
    "tw-animate-css",
  ]);
});
