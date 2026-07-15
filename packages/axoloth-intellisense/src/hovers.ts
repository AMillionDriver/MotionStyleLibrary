import * as vscode from 'vscode';
import { AxolothRegistry, createClassDocumentation, createVariableDocumentation } from './data';

const AXO_WORD_RE = /(?:--axo|axo)-[a-z0-9-]+/;

export function createHoverProvider(registry: AxolothRegistry): vscode.HoverProvider {
  return {
    provideHover(document, position) {
      const config = vscode.workspace.getConfiguration('axolothIntelliSense');

      if (!config.get<boolean>('hover.enabled', true)) {
        return undefined;
      }

      const range = document.getWordRangeAtPosition(position, AXO_WORD_RE);

      if (!range) {
        return undefined;
      }

      const word = document.getText(range);

      if (word.startsWith('--axo-')) {
        const variableEntry = registry.variableMap.get(word);

        if (!variableEntry) {
          return undefined;
        }

        return new vscode.Hover(createVariableDocumentation(variableEntry), range);
      }

      const entry = registry.classMap.get(word);

      if (!entry) {
        return undefined;
      }

      return new vscode.Hover(createClassDocumentation(entry), range);
    },
  };
}
