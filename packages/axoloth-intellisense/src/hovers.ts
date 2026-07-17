import * as vscode from 'vscode';
import {
  AxolothRegistry,
  createBehaviorDocumentation,
  createClassDocumentation,
  createVariableDocumentation,
} from './data';

const AXO_CLASS_OR_VARIABLE_RE = /(?:--axo|axo)-[a-z0-9-]+/;
const AXO_DATA_ATTRIBUTE_RE = /data-axo-[a-z0-9-]+/;
const AXO_EVENT_RE = /axo:[a-z0-9]+(?:-[a-z0-9]+)+/;
const AXO_INITIALIZER_RE = /init[A-Z][A-Za-z0-9]*/;

export function createHoverProvider(registry: AxolothRegistry): vscode.HoverProvider {
  return {
    provideHover(document, position) {
      const config = vscode.workspace.getConfiguration('axolothIntelliSense');

      if (!config.get<boolean>('hover.enabled', true)) {
        return undefined;
      }

      const dataAttributeRange = document.getWordRangeAtPosition(position, AXO_DATA_ATTRIBUTE_RE);

      if (dataAttributeRange) {
        const word = document.getText(dataAttributeRange);
        const entry = registry.dataAttributeMap.get(word);

        if (entry) {
          return new vscode.Hover(
            createBehaviorDocumentation(entry, 'dataAttribute'),
            dataAttributeRange
          );
        }
      }

      const eventRange = document.getWordRangeAtPosition(position, AXO_EVENT_RE);

      if (eventRange) {
        const word = document.getText(eventRange);
        const entry = registry.eventMap.get(word);

        if (entry) {
          return new vscode.Hover(createBehaviorDocumentation(entry, 'event'), eventRange);
        }
      }

      const initializerRange = document.getWordRangeAtPosition(position, AXO_INITIALIZER_RE);

      if (initializerRange) {
        const word = document.getText(initializerRange);
        const entry = registry.initializerMap.get(word);

        if (entry) {
          return new vscode.Hover(
            createBehaviorDocumentation(entry, 'initializer'),
            initializerRange
          );
        }
      }

      const range = document.getWordRangeAtPosition(position, AXO_CLASS_OR_VARIABLE_RE);

      if (!range) return undefined;

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
