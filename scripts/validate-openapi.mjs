import SwaggerParser from '@apidevtools/swagger-parser';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const contractPath = path.resolve('public/openapi.json');
const apiRoot = path.resolve('api');

const document = await SwaggerParser.validate(contractPath);
const documented = new Set(Object.keys(document.paths));

async function collectHandlers(directory, prefix = '/api') {
  const entries = await readdir(directory, { withFileTypes: true });
  const handlers = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      handlers.push(...(await collectHandlers(absolutePath, `${prefix}/${entry.name}`)));
      continue;
    }
    if (!entry.name.endsWith('.js')) continue;
    const segment = entry.name.replace(/\.js$/, '').replace(/^\[([^\]]+)\]$/, '{$1}');
    handlers.push(`${prefix}/${segment}`);
  }
  return handlers;
}

const handlers = new Set(await collectHandlers(apiRoot));
const missingDocs = [...handlers].filter((route) => !documented.has(route));
const missingHandlers = [...documented].filter(
  (route) => route.startsWith('/api/') && !handlers.has(route)
);

if (missingDocs.length || missingHandlers.length) {
  if (missingDocs.length) console.error(`Handlers sem OpenAPI: ${missingDocs.join(', ')}`);
  if (missingHandlers.length) console.error(`Paths sem handler: ${missingHandlers.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`OpenAPI válido: ${handlers.size} handlers documentados.`);
}
