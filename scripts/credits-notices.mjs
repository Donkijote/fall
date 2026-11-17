import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "src/modules/credits/domain/software-notices.json");
const packages = Object.values(
  JSON.parse(
    execFileSync("pnpm", ["licenses", "list", "--prod", "--json"], { cwd: root, encoding: "utf8" }),
  ),
).flat();

// Its stylesheet is distributed through src/index.css; its CLI dependencies are not.
for (const name of ["shadcn"]) {
  if (packages.some((item) => item.name === name)) continue;
  const directory = join(root, "node_modules", name);
  const metadata = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
  packages.push({
    name,
    paths: [directory],
    versions: [metadata.version],
    license: metadata.license,
    author: typeof metadata.author === "string" ? metadata.author : metadata.author?.name,
    homepage: metadata.homepage,
  });
}

function noticesAt(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((file) => file.isFile() && /^(licen[cs]e|copying|notice)([.-]|$)/i.test(file.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((file) => ({
      file: file.name,
      text: readFileSync(join(directory, file.name), "utf8").trim(),
    }));
}

const entries = packages
  .map((item) => {
    const metadata = JSON.parse(readFileSync(join(item.paths[0], "package.json"), "utf8"));
    const repository =
      typeof metadata.repository === "string" ? metadata.repository : metadata.repository?.url;
    const rawSource = item.homepage || repository || `https://www.npmjs.com/package/${item.name}`;
    const source = rawSource
      .replace(/^git\+/, "")
      .replace(/^git:\/\//, "https://")
      .replace(/\.git$/, "");
    const seenTexts = new Set();
    const notices = item.paths
      .flatMap((directory) => {
        const version = JSON.parse(readFileSync(join(directory, "package.json"), "utf8")).version;
        return noticesAt(directory)
          .filter((notice) => {
            if (seenTexts.has(notice.text)) return false;
            seenTexts.add(notice.text);
            return true;
          })
          .map((notice) => ({ ...notice, file: `${version}/${notice.file}` }));
      })
      .sort((a, b) => a.file.localeCompare(b.file));
    const licenseUrl =
      item.license.match(/https?:\/\/[^\s]+/)?.[0].replace(/[.]+$/, "") ||
      (/^[a-z0-9.-]+$/i.test(item.license) && item.license !== "Unknown"
        ? `https://spdx.org/licenses/${item.license}.html`
        : "");
    return {
      id: `${item.name}@${[...item.versions].sort().join(",")}`,
      name: item.name,
      versions: [...item.versions].sort(),
      creator: item.author || "See the retained copyright notices.",
      source: /^https?:\/\//.test(source) ? source : `https://www.npmjs.com/package/${item.name}`,
      license: item.license,
      licenseUrl,
      noticeStatus: notices.length ? "packaged-notices-retained" : "upstream-review-pending",
      modifications:
        "Used as an installed dependency; Fall does not edit the upstream package sources.",
      notices,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const output =
  JSON.stringify(
    {
      scope:
        "Installed production dependency graph plus shadcn's distributed CSS. Tooling-only dependencies of the development CLI are excluded. This is a conservative superset of the browser bundle.",
      lockfileSha256: createHash("sha256")
        .update(readFileSync(join(root, "pnpm-lock.yaml")))
        .digest("hex"),
      entries,
    },
    null,
    2,
  ) + "\n";

if (process.argv.includes("--check")) {
  if (
    JSON.stringify(JSON.parse(readFileSync(target, "utf8"))) !== JSON.stringify(JSON.parse(output))
  )
    throw new Error("Software notices are stale. Run pnpm credits:notices.");
} else {
  writeFileSync(target, output);
}
console.log(
  `Collected ${entries.length} production dependency entries; ${entries.filter((entry) => !entry.notices.length).length} have no root license/notice file (review in the inventory).`,
);
