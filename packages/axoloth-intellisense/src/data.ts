import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { createRelatedVariablesMarkdown } from './classVariableGuidance';
import { DeprecatableEntry, formatDeprecationSummary } from './deprecation';

export interface AxolothClassEntry extends DeprecatableEntry {
  name: string;
  module: string;
  category: string;
  description: string;
  usage: string;
  relatedVariables: string[];
}

export interface AxolothVariableValueSuggestion {
  value: string;
  description: string;
}

export interface AxolothVariableEntry extends DeprecatableEntry {
  name: string;
  module: string;
  category: string;
  valueType?: string;
  default: string;
  description: string;
  valueSuggestions?: AxolothVariableValueSuggestion[];
}

export type AxolothBehaviorKind = 'dataAttribute' | 'event' | 'initializer';

export interface AxolothBehaviorEntry extends DeprecatableEntry {
  name: string;
  behavior: string;
  description: string;
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

interface RawBehaviorRegistryData {
  name: string;
  version: string;
  initializers: AxolothBehaviorEntry[];
  dataAttributes: AxolothBehaviorEntry[];
  events: AxolothBehaviorEntry[];
}

interface RawBehaviorDeprecationRecord {
  kind: AxolothBehaviorKind | 'export';
  name: string;
  replacement: string;
  deprecatedIn: string;
  removeIn: string;
  note: string;
  status: 'alias' | 'removed';
}

interface RawBehaviorDeprecationData {
  deprecations: RawBehaviorDeprecationRecord[];
}

export interface AxolothRegistry {
  packageName: string;
  version: string;
  prefix: string;
  classes: AxolothClassEntry[];
  classMap: Map<string, AxolothClassEntry>;
  variables: AxolothVariableEntry[];
  variableMap: Map<string, AxolothVariableEntry>;
  behaviorPackageName: string;
  behaviorVersion: string;
  dataAttributes: AxolothBehaviorEntry[];
  dataAttributeMap: Map<string, AxolothBehaviorEntry>;
  events: AxolothBehaviorEntry[];
  eventMap: Map<string, AxolothBehaviorEntry>;
  initializers: AxolothBehaviorEntry[];
  initializerMap: Map<string, AxolothBehaviorEntry>;
}

export function loadRegistry(extensionPath: string): AxolothRegistry {
  const classDataPath = path.join(extensionPath, 'data', 'classes.json');
  const variableDataPath = path.join(extensionPath, 'data', 'variables.json');
  const behaviorRegistryPath = path.join(extensionPath, 'data', 'behavior.registry.json');
  const behaviorDeprecationsPath = path.join(extensionPath, 'data', 'behavior.deprecations.json');
  const classRaw = fs.readFileSync(classDataPath, 'utf8');
  const variableRaw = fs.readFileSync(variableDataPath, 'utf8');
  const behaviorRegistryRaw = fs.readFileSync(behaviorRegistryPath, 'utf8');
  const behaviorDeprecationsRaw = fs.readFileSync(behaviorDeprecationsPath, 'utf8');
  const data = JSON.parse(classRaw) as RawClassData;
  const variableData = JSON.parse(variableRaw) as RawVariableData;
  const behaviorData = JSON.parse(behaviorRegistryRaw) as RawBehaviorRegistryData;
  const behaviorDeprecations = JSON.parse(behaviorDeprecationsRaw) as RawBehaviorDeprecationData;
  const classMap = new Map(data.classes.map((entry) => [entry.name, entry]));
  const variableMap = new Map(variableData.variables.map((entry) => [entry.name, entry]));
  const deprecationMap = createBehaviorDeprecationMap(behaviorDeprecations.deprecations);
  const dataAttributes = decorateBehaviorEntries(
    behaviorData.dataAttributes,
    'dataAttribute',
    deprecationMap
  );
  const events = decorateBehaviorEntries(behaviorData.events, 'event', deprecationMap);
  const initializers = decorateBehaviorEntries(
    behaviorData.initializers,
    'initializer',
    deprecationMap
  );

  return {
    packageName: data.name,
    version: data.version,
    prefix: data.prefix,
    classes: data.classes,
    classMap,
    variables: variableData.variables,
    variableMap,
    behaviorPackageName: behaviorData.name,
    behaviorVersion: behaviorData.version,
    dataAttributes,
    dataAttributeMap: new Map(dataAttributes.map((entry) => [entry.name, entry])),
    events,
    eventMap: new Map(events.map((entry) => [entry.name, entry])),
    initializers,
    initializerMap: new Map(initializers.map((entry) => [entry.name, entry])),
  };
}

function createBehaviorDeprecationMap(
  records: RawBehaviorDeprecationRecord[]
): Map<string, RawBehaviorDeprecationRecord> {
  return new Map(
    records
      .filter((record) => record.status === 'alias')
      .map((record) => [`${record.kind}:${record.name}`, record])
  );
}

function decorateBehaviorEntries(
  entries: AxolothBehaviorEntry[],
  kind: AxolothBehaviorKind,
  deprecations: Map<string, RawBehaviorDeprecationRecord>
): AxolothBehaviorEntry[] {
  return entries.map((entry) => {
    const deprecation = deprecations.get(`${kind}:${entry.name}`);

    if (!deprecation) {
      return { ...entry, status: 'active' };
    }

    return {
      ...entry,
      status: 'deprecated',
      deprecation: {
        replacement: deprecation.replacement,
        deprecatedIn: deprecation.deprecatedIn,
        removeIn: deprecation.removeIn,
        note: deprecation.note,
      },
    };
  });
}

export function createClassDocumentation(
  entry: AxolothClassEntry,
  variableMap: ReadonlyMap<string, AxolothVariableEntry>
): vscode.MarkdownString {
  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.isTrusted = false;
  markdown.appendMarkdown(`**${entry.name}**\n\n`);
  markdown.appendMarkdown(`${entry.description}\n\n`);
  const deprecation = formatDeprecationSummary(entry);
  if (deprecation) markdown.appendMarkdown(`> **Deprecated:** ${deprecation}\n\n`);
  markdown.appendMarkdown(`Category: \`${entry.category}\`  \n`);
  markdown.appendMarkdown(`Module: \`${entry.module}\``);

  markdown.appendMarkdown(`\n\n${entry.usage}`);

  const relatedVariables = createRelatedVariablesMarkdown(entry, variableMap);
  if (relatedVariables) markdown.appendMarkdown(`\n\n${relatedVariables}`);

  return markdown;
}

export function createVariableDocumentation(entry: AxolothVariableEntry): vscode.MarkdownString {
  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.isTrusted = false;
  markdown.appendMarkdown(`**${entry.name}**\n\n`);
  markdown.appendMarkdown(`${entry.description}\n\n`);
  const deprecation = formatDeprecationSummary(entry);
  if (deprecation) markdown.appendMarkdown(`> **Deprecated:** ${deprecation}\n\n`);
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

export function createBehaviorDocumentation(
  entry: AxolothBehaviorEntry,
  kind: AxolothBehaviorKind
): vscode.MarkdownString {
  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.isTrusted = false;
  markdown.appendMarkdown(`**${entry.name}**\n\n`);
  markdown.appendMarkdown(`${entry.description}\n\n`);
  const deprecation = formatDeprecationSummary(entry);
  if (deprecation) markdown.appendMarkdown(`> **Deprecated:** ${deprecation}\n\n`);
  markdown.appendMarkdown(`Kind: \`${formatBehaviorKind(kind)}\`  \n`);
  markdown.appendMarkdown(`Behavior: \`${entry.behavior}\``);

  return markdown;
}

function formatBehaviorKind(kind: AxolothBehaviorKind): string {
  switch (kind) {
    case 'dataAttribute':
      return 'data attribute';
    case 'event':
      return 'custom event';
    case 'initializer':
      return 'initializer';
    default:
      return kind;
  }
}
