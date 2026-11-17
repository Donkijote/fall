import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "src/modules/credits/domain/software-notices.json");
const reportName = "bundled-code-licenses.json";

// CSS is flattened by the CSS pipeline, outside Vite's JavaScript module report.
const distributedCss = [
  { name: "tailwindcss", specifier: "tailwindcss", source: "src/index.css" },
  { name: "shadcn", specifier: "shadcn/tailwind.css", source: "src/index.css" },
  { name: "tw-animate-css", specifier: "tw-animate-css", source: "src/index.css" },
];

export function selectPackages(installed, bundledCode, assets) {
  if (!Array.isArray(bundledCode) || !bundledCode.length) {
    throw new Error(
      "The production build contains no bundled package metadata; refusing to drop notices.",
    );
  }
  const required = new Map();
  for (const item of [...bundledCode, ...assets]) {
    if (typeof item.name !== "string" || typeof item.version !== "string") {
      throw new Error("Invalid package identity in the production build report.");
    }
    required.set(`${item.name}@${item.version}`, item);
  }
  for (const item of required.values()) {
    if (
      !installed.some(
        (candidate) => candidate.name === item.name && candidate.versions.includes(item.version),
      )
    ) {
      throw new Error(
        `No installed license metadata for bundled package ${item.name}@${item.version}.`,
      );
    }
  }
  return installed
    .flatMap((item) => {
      const versions = item.versions
        .filter((version) => required.has(`${item.name}@${version}`))
        .sort();
      if (!versions.length) return [];
      const includedBy = [];
      if (bundledCode.some((entry) => entry.name === item.name && versions.includes(entry.version)))
        includedBy.push("production JavaScript chunks");
      for (const asset of assets.filter(
        (entry) => entry.name === item.name && versions.includes(entry.version),
      ))
        includedBy.push(`${asset.source}: ${asset.specifier}`);
      return [{ ...item, versions, includedBy }];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function assertCurrentInventory(current, expected) {
  if (JSON.stringify(current) !== JSON.stringify(expected)) {
    throw new Error(
      "Software notices are stale for this production build. Run pnpm credits:notices.",
    );
  }
}

async function bundledPackages(fromBuild) {
  if (fromBuild) return JSON.parse(readFileSync(join(root, "dist", reportName), "utf8"));
  const { build } = await import("vite");
  // Use the real production config and all lazy chunks, without touching dist or starting a server.
  const result = await build({
    root,
    mode: "production",
    logLevel: "silent",
    build: { write: false, watch: null, license: { fileName: reportName } },
  });
  const output = (Array.isArray(result) ? result : [result]).flatMap((item) => item.output);
  const report = output.find((item) => item.type === "asset" && item.fileName === reportName);
  if (!report) throw new Error("The production build did not emit its bundled license report.");
  return JSON.parse(
    typeof report.source === "string" ? report.source : Buffer.from(report.source).toString("utf8"),
  );
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

function createEntry(item) {
  // A package group can have several installed versions; retain only the versions actually shipped.
  const paths = item.paths.filter((directory) =>
    item.versions.includes(
      JSON.parse(readFileSync(join(directory, "package.json"), "utf8")).version,
    ),
  );
  if (!paths.length)
    throw new Error(`Installed package paths do not match shipped versions for ${item.name}.`);
  const metadata = JSON.parse(readFileSync(join(paths[0], "package.json"), "utf8"));
  const repository =
    typeof metadata.repository === "string" ? metadata.repository : metadata.repository?.url;
  const rawSource = item.homepage || repository || `https://www.npmjs.com/package/${item.name}`;
  const source = rawSource
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/\.git$/, "");
  const seenTexts = new Set();
  const notices = paths
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
  const license = item.license || "Unknown";
  const licenseUrl =
    license.match(/https?:\/\/[^\s]+/)?.[0].replace(/[.]+$/, "") ||
    (/^[a-z0-9.-]+$/i.test(license) && license !== "Unknown"
      ? `https://spdx.org/licenses/${license}.html`
      : "");
  return {
    id: `${item.name}@${item.versions.join(",")}`,
    name: item.name,
    versions: item.versions,
    includedBy: item.includedBy,
    creator: item.author || "See the retained copyright notices.",
    source: /^https?:\/\//.test(source) ? source : `https://www.npmjs.com/package/${item.name}`,
    license,
    licenseUrl,
    noticeStatus: notices.length ? "packaged-notices-retained" : "upstream-review-pending",
    modifications:
      "Used as an installed dependency; Fall does not edit the upstream package sources.",
    notices,
  };
}

async function main() {
  const bundledCode = (await bundledPackages(process.argv.includes("--from-build")))
    .map(({ name, version }) => ({ name, version }))
    .sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version));
  const assets = distributedCss.map((asset) => {
    if (!readFileSync(join(root, asset.source), "utf8").includes(`@import "${asset.specifier}"`)) {
      throw new Error(
        `Review the distributed CSS entry for ${asset.name}: its recorded import is absent.`,
      );
    }
    const metadata = JSON.parse(
      readFileSync(join(root, "node_modules", asset.name, "package.json"), "utf8"),
    );
    return { ...asset, version: metadata.version };
  });
  // Installed metadata supplies notices only; the build report determines membership.
  const installed = Object.values(
    JSON.parse(
      execFileSync("pnpm", ["licenses", "list", "--json"], { cwd: root, encoding: "utf8" }),
    ),
  ).flat();
  const entries = selectPackages(installed, bundledCode, assets).map(createEntry);
  const inventory = {
    scope:
      "Packages included in the production JavaScript chunks, plus reviewed distributed CSS imports. Fonts and artwork are inventoried separately.",
    lockfileSha256: createHash("sha256")
      .update(readFileSync(join(root, "pnpm-lock.yaml")))
      .digest("hex"),
    bundledCode,
    distributedAssets: assets,
    entries,
  };
  if (process.argv.includes("--check")) {
    assertCurrentInventory(JSON.parse(readFileSync(target, "utf8")), inventory);
  } else {
    writeFileSync(target, JSON.stringify(inventory, null, 2) + "\n");
  }
  console.log(
    `Collected ${entries.length} shipped package entries (${bundledCode.length} code packages and ${assets.length} CSS imports); ${entries.filter((entry) => !entry.notices.length).length} have no root license/notice file.`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
