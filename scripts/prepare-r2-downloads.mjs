// Keep APK payloads out of both Vercel and Workers deployment artifacts.
import { readFile, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(await readFile('src/data/r2-downloads.json', 'utf8'));
const files = new Map(manifest.files.map(file => [file.path, file]));
const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
const cfRedirects = await readFile('dist/_redirects', 'utf8');
for (const file of manifest.files) {
  const destination = `${manifest.public_url}/${file.key}`;
  if (!vercel.redirects.some(rule => rule.source === file.path && rule.destination === destination) || !cfRedirects.includes(`${file.path} ${destination} 302`)) throw new Error(`R2 redirect mismatch: ${file.path}`);
}
for (const name of await readdir('dist/downloads')) {
  if (!name.endsWith('.apk')) continue;
  const file = files.get(`/downloads/${name}`);
  if (!file) throw new Error(`Upload ${name} to R2 and register its redirect before publishing.`);
  const bytes = await readFile(`dist/downloads/${name}`);
  if (bytes.length !== file.bytes || createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`APK changed: upload ${name} to R2 and update its manifest and redirects.`);
  await rm(`dist/downloads/${name}`);
}
console.log('APK downloads use R2; deployment artifact contains no APK files.');
