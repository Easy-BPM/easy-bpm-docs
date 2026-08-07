import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const files = [
  join(process.cwd(), 'node_modules', 'gray-matter', 'lib', 'parse.js'),
  join(process.cwd(), 'node_modules', 'gray-matter', 'lib', 'engines.js'),
];

for (const file of files) {
  if (!existsSync(file)) {
    continue;
  }

  const source = readFileSync(file, 'utf8');
  const patched = source
    .replace(/\.safeLoad\(/g, '.load(')
    .replace(/\.safeLoad\.bind\(/g, '.load.bind(');

  if (patched !== source) {
    writeFileSync(file, patched);
  }
}
