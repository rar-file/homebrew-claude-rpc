#!/usr/bin/env node
// Point Formula/claude-rpc.rb at the latest claude-rpc on npm. Fetches the
// registry's `latest`, downloads that tarball, checks it against the
// registry's sha512 integrity, and rewrites the formula's url + sha256.
// Prints `changed=true|false` (and `version=`) for the workflow; no deps.
//
//   node .github/scripts/bump.mjs            update the formula in place
//   node .github/scripts/bump.mjs --check    exit 1 if it is behind npm
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const FORMULA = 'Formula/claude-rpc.rb';
const check = process.argv.includes('--check');

function out(key, value) {
  console.log(`${key}=${value}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

const res = await fetch('https://registry.npmjs.org/claude-rpc/latest');
if (!res.ok) throw new Error(`npm registry: HTTP ${res.status}`);
const { version, dist } = await res.json();
const url = dist.tarball;

let formula = readFileSync(FORMULA, 'utf8');
const current = formula.match(/^\s*url "([^"]+)"/m)?.[1];
out('version', version);
if (current === url) { out('changed', 'false'); process.exit(0); }
if (check) { console.error(`formula is on ${current}, npm latest is ${url}`); process.exit(1); }

// The tarball can 404 for a few minutes after `npm publish` while the CDN
// catches up with the metadata; a later scheduled run picks it up.
const tgz = await fetch(url);
if (!tgz.ok) { console.error(`tarball not served yet (HTTP ${tgz.status}): ${url}`); out('changed', 'false'); process.exit(0); }
const buf = Buffer.from(await tgz.arrayBuffer());

const integrity = 'sha512-' + createHash('sha512').update(buf).digest('base64');
if (dist.integrity && integrity !== dist.integrity) {
  throw new Error(`integrity mismatch for ${url}: got ${integrity}, registry says ${dist.integrity}`);
}
const sha = createHash('sha256').update(buf).digest('hex');

formula = formula
  .replace(/^(\s*)url ".*"/m, `$1url "${url}"`)
  .replace(/^(\s*)sha256 ".*"/m, `$1sha256 "${sha}"`);
writeFileSync(FORMULA, formula);
out('changed', 'true');
