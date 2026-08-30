import { readdir } from 'node:fs/promises';
import path from 'node:path';

const ignored = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const forbiddenNames = new Set(['.claude', 'claude.md']);
const matches = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (forbiddenNames.has(entry.name.toLowerCase())) matches.push(path.relative(process.cwd(), absolutePath));
    if (entry.isDirectory()) await walk(absolutePath);
  }
}

await walk(process.cwd());

if (matches.length > 0) {
  console.error(`Estrutura Claude Code encontrada: ${matches.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('Nenhuma estrutura Claude Code encontrada.');
}
