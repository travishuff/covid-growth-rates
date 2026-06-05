import { readFileSync, writeFileSync } from 'node:fs';

const bump = (process.argv[2] || 'patch').toLowerCase();
const allowed = new Set(['major', 'minor', 'patch']);

if (!allowed.has(bump)) {
  console.error(`Unsupported bump type "${bump}". Use major, minor, or patch.`);
  process.exit(1);
}

const packagePath = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));

const [major, minor, patch] = packageJson.version.split('.').map(Number);

if ([major, minor, patch].some((part) => Number.isNaN(part))) {
  console.error(`Invalid version "${packageJson.version}" in package.json.`);
  process.exit(1);
}

let nextMajor = major;
let nextMinor = minor;
let nextPatch = patch;

if (bump === 'major') {
  nextMajor += 1;
  nextMinor = 0;
  nextPatch = 0;
} else if (bump === 'minor') {
  nextMinor += 1;
  nextPatch = 0;
} else {
  nextPatch += 1;
}

const nextVersion = `${nextMajor}.${nextMinor}.${nextPatch}`;
packageJson.version = nextVersion;

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

console.log(nextVersion);
