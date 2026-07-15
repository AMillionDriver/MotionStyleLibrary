import * as vscode from 'vscode';
import { AxolothRegistry } from './data';
import { AXOLOTH_DIAGNOSTIC_SOURCE, UNKNOWN_AXOLOTH_CLASS_CODE } from './diagnostics';
import { findClosestClass } from './classMatcher';

export function createCodeActionProvider(registry: AxolothRegistry): vscode.CodeActionProvider {
  return {
    provideCodeActions(document, _range, context) {
      const diagnostics = context.diagnostics.filter(isUnknownAxolothClassDiagnostic);
      const actions: vscode.CodeAction[] = [];

      diagnostics.forEach((diagnostic) => {
        const unknownClass = document.getText(diagnostic.range);
        const closestClass = findClosestClass(
          unknownClass,
          registry.classes.map((entry) => entry.name)
        );

        if (closestClass) {
          actions.push(createReplaceAction(document, diagnostic, unknownClass, closestClass));
        }

        actions.push(createRemoveAction(document, diagnostic, unknownClass));
      });

      return actions;
    },
  };
}

function isUnknownAxolothClassDiagnostic(diagnostic: vscode.Diagnostic): boolean {
  return (
    diagnostic.source === AXOLOTH_DIAGNOSTIC_SOURCE &&
    diagnostic.code === UNKNOWN_AXOLOTH_CLASS_CODE
  );
}

function createReplaceAction(
  document: vscode.TextDocument,
  diagnostic: vscode.Diagnostic,
  unknownClass: string,
  closestClass: string
): vscode.CodeAction {
  const action = new vscode.CodeAction(
    `Replace ${unknownClass} with ${closestClass}`,
    vscode.CodeActionKind.QuickFix
  );
  action.diagnostics = [diagnostic];
  action.isPreferred = true;
  action.edit = new vscode.WorkspaceEdit();
  action.edit.replace(document.uri, diagnostic.range, closestClass);

  return action;
}

function createRemoveAction(
  document: vscode.TextDocument,
  diagnostic: vscode.Diagnostic,
  unknownClass: string
): vscode.CodeAction {
  const action = new vscode.CodeAction(
    `Remove unknown Axoloth class ${unknownClass}`,
    vscode.CodeActionKind.QuickFix
  );
  action.diagnostics = [diagnostic];
  action.edit = new vscode.WorkspaceEdit();
  action.edit.delete(document.uri, getRemovalRange(document, diagnostic.range));

  return action;
}

function getRemovalRange(document: vscode.TextDocument, range: vscode.Range): vscode.Range {
  const line = document.lineAt(range.start.line).text;
  let startCharacter = range.start.character;
  let endCharacter = range.end.character;

  if (line[endCharacter] === ' ') {
    endCharacter += 1;
  } else if (line[startCharacter - 1] === ' ') {
    startCharacter -= 1;
  }

  return new vscode.Range(range.start.line, startCharacter, range.end.line, endCharacter);
}
