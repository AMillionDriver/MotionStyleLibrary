import * as vscode from 'vscode';
import { AxolothRegistry, createClassDocumentation } from './data';

const AXO_WORD_RE = /axo-[a-z0-9-]+/;

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

      const className = document.getText(range);
      const entry = registry.classMap.get(className);

      if (!entry) {
        return undefined;
      }

      return new vscode.Hover(createClassDocumentation(entry), range);
    },
  };
}
