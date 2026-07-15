import * as vscode from 'vscode';
import { getCompletionContext, getUsedClassesFromContext } from './classContext';
import { AxolothRegistry, createClassDocumentation } from './data';

const CATEGORY_ORDER: Record<string, string> = {
  layout: '1',
  surface: '2',
  motion: '3',
};

export function createCompletionProvider(registry: AxolothRegistry): vscode.CompletionItemProvider {
  return {
    provideCompletionItems(document, position) {
      const config = vscode.workspace.getConfiguration('axolothIntelliSense');

      if (!config.get<boolean>('completions.enabled', true)) {
        return [];
      }

      const line = document.lineAt(position.line).text;
      const context = getCompletionContext(line, position.character);

      if (!context) {
        return [];
      }

      const usedClasses = getUsedClassesFromContext(context);
      const range = new vscode.Range(
        position.line,
        context.replaceStart,
        position.line,
        context.replaceEnd
      );

      return registry.classes
        .filter((entry) => entry.name.startsWith(context.currentToken))
        .filter((entry) => !usedClasses.has(entry.name))
        .map((entry) => {
          const item = new vscode.CompletionItem(entry.name, vscode.CompletionItemKind.Class);
          item.detail = `Axoloth ${entry.category} utility`;
          item.documentation = createClassDocumentation(entry);
          item.filterText = entry.name;
          item.insertText = entry.name;
          item.range = range;
          item.sortText = `${CATEGORY_ORDER[entry.category] ?? '9'}-${entry.name}`;

          return item;
        });
    },
  };
}
