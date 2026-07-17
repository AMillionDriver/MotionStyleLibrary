import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const defaultPackageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function listJavaScriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) return listJavaScriptFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
  });
}

function collectMatches(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

export async function collectBehaviorSourceApi({
  packageDirectory = defaultPackageDirectory,
} = {}) {
  const sourceDirectory = resolve(packageDirectory, 'src');
  const sourceFiles = listJavaScriptFiles(sourceDirectory);
  const source = sourceFiles.map((filePath) => readFileSync(filePath, 'utf8')).join('\n');
  const publicSource = sourceFiles
    .filter((filePath) => dirname(filePath) === sourceDirectory)
    .map((filePath) => readFileSync(filePath, 'utf8'))
    .join('\n');
  const entryModule = await import(pathToFileURL(resolve(sourceDirectory, 'index.js')).href);
  const initializers = Object.keys(entryModule).filter((name) => /^init[A-Z]/.test(name));
  const dataAttributes = collectMatches(source, /\b(data-axo-[a-z0-9-]+)\b/g);
  const literalEvents = collectMatches(publicSource, /['"](axo:[a-z0-9]+-[a-z0-9-]+)['"]/g);
  const stateEventPrefixes = collectMatches(
    publicSource,
    /eventPrefix:\s*['"](axo:[a-z0-9]+)['"]/g
  );
  const stateEvents = stateEventPrefixes.flatMap((prefix) => [`${prefix}-close`, `${prefix}-open`]);

  return {
    initializers: [...new Set(initializers)].sort(),
    dataAttributes: [...new Set(dataAttributes)].sort(),
    events: [...new Set([...literalEvents, ...stateEvents])].sort(),
  };
}
