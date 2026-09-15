// Verifies the published legal documents are byte-identical to what the app records.
//
// Two checks: (1) every public/legal/<doc>/<version>/document.html matches the sha256
// pinned in public/legal/manifest.json (runs everywhere, including Amplify CI, where
// the backend checkout does not exist); (2) when the sibling backend checkout is
// present locally, its legal/<doc>/<version>.html must match the same hash — that is
// how the manifest is kept honest. Run `node scripts/verify-legal-bytes.mjs --write`
// locally to refresh the manifest from the backend files.
import { createHash } from "node:crypto";
import { readFile, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const backendRoot = join(projectRoot, "..", "refleo-aws-backend");
const manifestPath = join(projectRoot, "public", "legal", "manifest.json");
const documents = [
  ["privacy", "2026-09-18"],
  ["terms", "2026-09-18"],
  ["baa", "1.0"],
  ["parental_consent", "1.0"],
  ["minor_acknowledgment", "1.0"],
];
const write = process.argv.includes("--write");
const sha256 = (b) => createHash("sha256").update(b).digest("hex");
const exists = (p) => access(p).then(() => true, () => false);

const backendPresent = await exists(join(backendRoot, "legal"));
let manifest = {};
if (!write) manifest = JSON.parse(await readFile(manifestPath, "utf8"));
let failed = false;

for (const [document, version] of documents) {
  const key = `${document}/${version}`;
  const publicPath = join(projectRoot, "public", "legal", document, version, "document.html");
  const publicHash = sha256(await readFile(publicPath));
  if (backendPresent) {
    const sourceHash = sha256(await readFile(join(backendRoot, "legal", document, `${version}.html`)));
    if (sourceHash !== publicHash) {
      failed = true;
      console.error(`Legal byte mismatch vs backend: ${key}\n  backend: ${sourceHash}\n  public:  ${publicHash}`);
      continue;
    }
  }
  if (write) {
    manifest[key] = publicHash;
    console.log(`Pinned ${key}: ${publicHash}`);
  } else if (manifest[key] !== publicHash) {
    failed = true;
    console.error(`Legal byte mismatch vs manifest: ${key}\n  manifest: ${manifest[key]}\n  public:   ${publicHash}`);
  } else {
    console.log(`Verified ${key}: ${publicHash}${backendPresent ? " (backend matched)" : ""}`);
  }
}

if (write && !failed) await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
if (failed) process.exitCode = 1;
