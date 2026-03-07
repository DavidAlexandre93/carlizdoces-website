import fs from 'node:fs';

const files = ['src/App.css', 'src/index.css', 'src/styles/globals.css'];
const breakpoints = [];
const risky = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  let mediaStack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mediaMatch = line.match(/@media\s*\((max|min)-width:\s*(\d+)px\)/);
    if (mediaMatch) {
      mediaStack.push({ type: mediaMatch[1], value: Number(mediaMatch[2]) });
      breakpoints.push({ file, line: i + 1, query: mediaMatch[0] });
    }

    if (line.includes('{')) {
      // noop
    }
    if (line.includes('}')) {
      if (mediaStack.length > 0) mediaStack.pop();
    }

    const declMatch = line.match(/\b(min-width|max-width|width|height):\s*([0-9]+)px\b/);
    if (declMatch) {
      const [, prop, px] = declMatch;
      const val = Number(px);
      const guardedByMobile = mediaStack.some((m) => m.type === 'max' && m.value <= 960);
      if ((prop === 'min-width' && val >= 320) || ((prop === 'width' || prop === 'height') && val >= 600)) {
        risky.push({ file, line: i + 1, prop, val, guardedByMobile });
      }
    }
  }
}

const uniqueBps = [...new Set(breakpoints.map((b) => b.query))]
  .map((q) => Number(q.match(/(\d+)px/)[1]))
  .sort((a, b) => a - b);

console.log('Responsive audit (static CSS analysis)');
console.log('Files:', files.join(', '));
console.log('Detected breakpoints:', uniqueBps.join(', ') || 'none');
console.log('Total media queries:', breakpoints.length);

const riskyUnguarded = risky.filter((r) => !r.guardedByMobile);
console.log('Potentially risky fixed dimensions (not under <=960px max-width query):', riskyUnguarded.length);
for (const item of riskyUnguarded.slice(0, 30)) {
  console.log(`- ${item.file}:${item.line} ${item.prop}: ${item.val}px`);
}
if (riskyUnguarded.length > 30) {
  console.log(`... and ${riskyUnguarded.length - 30} more`);
}
