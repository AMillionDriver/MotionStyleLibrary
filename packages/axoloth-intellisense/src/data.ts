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

export interface AxolothVariableValueSuggestion {
  value: string;
  description: string;
}

export interface AxolothVariableEntry {
  name: string;
  module: string;
  category: string;
  valueType?: string;
  default: string;
  description: string;
  valueSuggestions?: AxolothVariableValueSuggestion[];
}

interface RawClassData {
  name: string;
  version: string;
  prefix: string;
  classes: AxolothClassEntry[];
}

interface RawVariableData {
  variables: AxolothVariableEntry[];
}

export interface AxolothRegistry {
  packageName: string;
  version: string;
  prefix: string;
  classes: AxolothClassEntry[];
  classMap: Map<string, AxolothClassEntry>;
  variables: AxolothVariableEntry[];
  variableMap: Map<string, AxolothVariableEntry>;
}

export function loadRegistry(extensionPath: string): AxolothRegistry {
  const classDataPath = path.join(extensionPath, 'data', 'classes.json');
  const variableDataPath = path.join(extensionPath, 'data', 'variables.json');
  const classRaw = fs.readFileSync(classDataPath, 'utf8');
  const variableRaw = fs.readFileSync(variableDataPath, 'utf8');
  const data = JSON.parse(classRaw) as RawClassData;
  const variableData = JSON.parse(variableRaw) as RawVariableData;
  const classMap = new Map(data.classes.map((entry) => [entry.name, entry]));
  const variableMap = new Map(variableData.variables.map((entry) => [entry.name, entry]));

  return {
    packageName: data.name,
    version: data.version,
    prefix: data.prefix,
    classes: data.classes,
    classMap,
    variables: variableData.variables,
    variableMap,
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

export function createVariableDocumentation(entry: AxolothVariableEntry): vscode.MarkdownString {
  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.isTrusted = false;
  markdown.appendMarkdown(`**${entry.name}**\n\n`);
  markdown.appendMarkdown(`${entry.description}\n\n`);
  markdown.appendMarkdown(`Default: \`${entry.default}\`  \n`);

  if (entry.valueType) {
    markdown.appendMarkdown(`Value type: \`${entry.valueType}\`  \n`);
  }

  markdown.appendMarkdown(`Category: \`${entry.category}\`  \n`);
  markdown.appendMarkdown(`Module: \`${entry.module}\``);

  if (entry.valueSuggestions?.length) {
    markdown.appendMarkdown('\n\nSuggested values:\n\n');

    entry.valueSuggestions.slice(0, 6).forEach((suggestion) => {
      markdown.appendMarkdown(`- \`${suggestion.value}\` - ${suggestion.description}\n`);
    });
  }

  return markdown;
}
