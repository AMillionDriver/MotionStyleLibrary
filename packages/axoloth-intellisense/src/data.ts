import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';

export interface AxolothClassEntry {
  name: string;
  module: string;
  category: string;
  description: string;
  usage?: string;
}

interface RawClassData {
  name: string;
  version: string;
  prefix: string;
  classes: AxolothClassEntry[];
}

export interface AxolothRegistry {
  packageName: string;
  version: string;
  prefix: string;
  classes: AxolothClassEntry[];
  classMap: Map<string, AxolothClassEntry>;
}

export function loadRegistry(extensionPath: string): AxolothRegistry {
  const dataPath = path.join(extensionPath, 'data', 'classes.json');
  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw) as RawClassData;
  const classMap = new Map(data.classes.map((entry) => [entry.name, entry]));

  return {
    packageName: data.name,
    version: data.version,
    prefix: data.prefix,
    classes: data.classes,
    classMap,
  };
}

export function createClassDocumentation(entry: AxolothClassEntry): vscode.MarkdownString {
  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.isTrusted = false;
  markdown.appendMarkdown(`**${entry.name}**\n\n`);
  markdown.appendMarkdown(`${entry.description}\n\n`);
  markdown.appendMarkdown(`Category: \`${entry.category}\`  \n`);
  markdown.appendMarkdown(`Module: \`${entry.module}\``);

  if (entry.usage) {
    markdown.appendMarkdown(`\n\n${entry.usage}`);
  }

  return markdown;
}
