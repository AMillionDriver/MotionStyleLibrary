import * as vscode from 'vscode';
import {
  getCssVariableCompletionContext,
  getCssVariableValueCompletionContext,
} from './cssVariableContext';
import {
  AxolothRegistry,
  AxolothVariableEntry,
  AxolothVariableValueSuggestion,
  createVariableDocumentation,
} from './data';
import { formatDeprecationSummary } from './deprecation';

function createVariableValueDocumentation(
  entry: AxolothVariableEntry,
  suggestion: AxolothVariableValueSuggestion
): vscode.MarkdownString {
  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.isTrusted = false;
  markdown.appendMarkdown(`**${suggestion.value}**\n\n`);
  markdown.appendMarkdown(`${suggestion.description}\n\n`);
  markdown.appendMarkdown(`Variable: \`${entry.name}\`  \n`);
  markdown.appendMarkdown(`Default: \`${entry.default}\`  \n`);
  markdown.appendMarkdown(`Value type: \`${entry.valueType ?? 'css'}\``);
  const deprecation = formatDeprecationSummary(entry);
  if (deprecation) markdown.appendMarkdown(`\n\n> **Deprecated:** ${deprecation}`);

  return markdown;
}

function getValueSuggestions(entry: AxolothVariableEntry): AxolothVariableValueSuggestion[] {
  if (entry.valueSuggestions?.length) {
    return entry.valueSuggestions;
  }

  return [
    {
      value: entry.default,
      description: 'Default value.',
    },
  ];
}

export function createCssVariableCompletionProvider(
  registry: AxolothRegistry
): vscode.CompletionItemProvider {
  return {
    provideCompletionItems(document, position) {
      const config = vscode.workspace.getConfiguration('axolothIntelliSense');

      if (!config.get<boolean>('completions.enabled', true)) {
        return [];
      }

      const line = document.lineAt(position.line).text;
      const context = getCssVariableCompletionContext(line, position.character);

      if (!context) {
        return [];
      }

      const range = new vscode.Range(
        position.line,
        context.replaceStart,
        position.line,
        context.replaceEnd
      );

      return registry.variables
        .filter((entry) => entry.name.startsWith(context.currentToken))
        .map((entry) => {
          const item = new vscode.CompletionItem(entry.name, vscode.CompletionItemKind.Variable);
          item.detail = `Axoloth ${entry.module} variable`;
          item.documentation = createVariableDocumentation(entry);
          item.filterText = entry.name;
          item.insertText = entry.name;
          item.range = range;
          item.preselect = true;
          item.sortText = `!${entry.name}`;

          if (entry.status === 'deprecated') {
            item.tags = [vscode.CompletionItemTag.Deprecated];
            item.detail = `Deprecated Axoloth variable; use ${entry.deprecation?.replacement}`;
            item.sortText = `~${entry.name}`;
          }

          return item;
        });
    },
  };
}

export function createCssVariableValueCompletionProvider(
  registry: AxolothRegistry
): vscode.CompletionItemProvider {
  return {
    provideCompletionItems(document, position) {
      const config = vscode.workspace.getConfiguration('axolothIntelliSense');

      if (!config.get<boolean>('completions.enabled', true)) {
        return [];
      }

      const line = document.lineAt(position.line).text;
      const context = getCssVariableValueCompletionContext(line, position.character);

      if (!context) {
        return [];
      }

      const entry = registry.variableMap.get(context.variableName);

      if (!entry) {
        return [];
      }

      const range = new vscode.Range(
        position.line,
        context.replaceStart,
        position.line,
        context.replaceEnd
      );

      return getValueSuggestions(entry).map((suggestion, index) => {
        const item = new vscode.CompletionItem(suggestion.value, vscode.CompletionItemKind.Value);
        item.detail = `Value for ${entry.name}`;
        item.documentation = createVariableValueDocumentation(entry, suggestion);
        item.filterText = suggestion.value;
        item.insertText = suggestion.value;
        item.range = range;
        item.preselect = suggestion.value === entry.default;
        item.sortText = `${index.toString().padStart(2, '0')}-${suggestion.value}`;

        return item;
      });
    },
  };
}
