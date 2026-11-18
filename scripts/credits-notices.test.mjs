// @vitest-environment node
import { expect, test } from "vitest";

import { assertCurrentInventory, selectPackages } from "./credits-notices.mjs";

const installed = [
  { name: "used-library", versions: ["1.0.0", "2.0.0"], paths: ["old", "new"] },
  { name: "optional-camera", versions: ["1.0.0"], paths: ["camera"] },
  { name: "dev-styles", versions: ["3.0.0"], paths: ["styles"] },
  { name: "dev-cli-helper", versions: ["1.0.0"], paths: ["cli"] },
];

test("retains bundled versions and explicitly distributed CSS without pulling optional or CLI dependencies", () => {
  const selected = selectPackages(
    installed,
    [{ name: "used-library", version: "2.0.0" }],
    [{ name: "dev-styles", version: "3.0.0", source: "src/index.css", specifier: "dev-styles" }],
  );
  expect(selected.map((entry) => entry.name)).toEqual(["dev-styles", "used-library"]);
  expect(selected.find((entry) => entry.name === "used-library").versions).toEqual(["2.0.0"]);
  expect(selected.find((entry) => entry.name === "dev-styles").includedBy).toEqual([
    "src/index.css: dev-styles",
  ]);
});

test("does not silently omit a bundled package with missing or mismatched installed metadata", () => {
  expect(() => selectPackages(installed, [{ name: "used-library", version: "9.0.0" }], [])).toThrow(
    "No installed license metadata",
  );
  expect(() => selectPackages(installed, [{ name: "new-library", version: "1.0.0" }], [])).toThrow(
    "No installed license metadata",
  );
  expect(() => selectPackages(installed, [], [])).toThrow("refusing to drop notices");
});

test("rejects stale notices after shipped membership changes even when the lockfile is unchanged", () => {
  const current = { lockfileSha256: "same-lock", entries: [{ name: "used-library" }] };
  const changedBuild = {
    lockfileSha256: "same-lock",
    entries: [{ name: "used-library" }, { name: "new-library" }],
  };
  expect(() => assertCurrentInventory(current, changedBuild)).toThrow(
    "stale for this production build",
  );
  expect(() => assertCurrentInventory(current, JSON.parse(JSON.stringify(current)))).not.toThrow();
});
