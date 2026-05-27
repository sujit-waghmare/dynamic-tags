#!/usr/bin/env node
/**
 * Bumps the version across manifest.json, package.json, and versions.json.
 *
 * Usage:  node version-bump.mjs <newVersion>
 * Example: node version-bump.mjs 1.6.0
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const newVersion = process.argv[2];
if (!newVersion || !/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error("Usage: node version-bump.mjs <newVersion>  (e.g. 1.6.0)");
  process.exit(1);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}
function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// manifest.json
const manifest = readJson("manifest.json");
manifest.version = newVersion;
writeJson("manifest.json", manifest);
console.log(`✓ manifest.json → ${newVersion}`);

// package.json
const pkg = readJson("package.json");
pkg.version = newVersion;
writeJson("package.json", pkg);
console.log(`✓ package.json  → ${newVersion}`);

// versions.json — append new entry mapping plugin version → min Obsidian version
const versionsPath = "versions.json";
const versions = existsSync(versionsPath) ? readJson(versionsPath) : {};
const minObsidian = manifest.minAppVersion || "1.0.0";
versions[newVersion] = minObsidian;
writeJson(versionsPath, versions);
console.log(`✓ versions.json → ${newVersion} (min Obsidian ${minObsidian})`);

console.log("\nDone. Now run `npm run build` and commit.");