import * as vscode from 'vscode';
import { getDataAttributeCompletionContext } from './behaviorContext';
import { AxolothRegistry, createBehaviorDocumentation } from './data';

const BEHAVIOR_ORDER: Record<string, string> = {
  offcanvas: '1',
  dialog: '2',
  tabs: '3',
  accordion: '4',
  dropdown: '5',
  toast: '6',
};

export function createBehaviorAttributeCompletionProvider(
  registry: AxolothRegistry
): vscode.CompletionItemProvider {
  return {
    provideCompletionItems(document, position) {
      const config = vscode.workspace.getConfiguration('axolothIntelliSense');

      if (!config.get<boolean>('completions.enabled', true)) {
        return [];
      }

      const line = document.lineAt(position.line).text;
      const context = getDataAttributeCompletionContext(line, position.character);

      if (!context) {
        return [];
      }

      const usedAttributes = new Set(context.usedAttributes);
      const range = new vscode.Range(
        position.line,
        context.replaceStart,
        position.line,
        context.replaceEnd
      );

      return registry.dataAttributes
        .filter((entry) => entry.name.startsWith(context.currentToken))
        .filter((entry) => !usedAttributes.has(entry.name))
        .map((entry) => {
          const item = new vscode.CompletionItem(entry.name, vscode.CompletionItemKind.Property);
          item.detail = `Axoloth ${entry.behavior} data attribute`;
          item.documentation = createBehaviorDocumentation(entry, 'dataAttribute');
          item.filterText = entry.name;
          item.insertText = entry.name;
          item.range = range;
          item.sortText = `${entry.status === 'deprecated' ? 'z' : (BEHAVIOR_ORDER[entry.behavior] ?? '9')}-${entry.name}`;

          if (entry.status === 'deprecated') {
            item.tags = [vscode.CompletionItemTag.Deprecated];
            item.detail = `Deprecated Axoloth data attribute; use ${entry.deprecation?.replacement}`;
          }

          return item;
        });
    },
  };
}
