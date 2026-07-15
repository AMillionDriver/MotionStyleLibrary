import * as vscode from 'vscode';
import { AxolothRegistry } from './data';

const AXO_CLASS_RE = /\baxo-[a-z0-9-]+\b/g;
const CLASS_LIKE_LINE_RE = /\bclass(?:Name|:list)?\s*=|\.axo-/;
export const AXOLOTH_DIAGNOSTIC_SOURCE = 'Axoloth IntelliSense';
export const UNKNOWN_AXOLOTH_CLASS_CODE = 'unknownAxolothClass';
const SUPPORTED_LANGUAGES = new Set([
  'html',
  'css',
  'javascriptreact',
  'typescriptreact',
  'vue',
  'svelte',
  'astro',
]);

export function isSupportedDocument(document: vscode.TextDocument): boolean {
  return (
    SUPPORTED_LANGUAGES.has(document.languageId) &&
    (document.uri.scheme === 'file' || document.uri.scheme === 'untitled')
  );
}

export function validateDocument(
  document: vscode.TextDocument,
  registry: AxolothRegistry,
  diagnostics: vscode.DiagnosticCollection
): void {
  const config = vscode.workspace.getConfiguration('axolothIntelliSense');

  if (!config.get<boolean>('diagnostics.enabled', true) || !isSupportedDocument(document)) {
    diagnostics.delete(document.uri);
    return;
  }

  const result: vscode.Diagnostic[] = [];

  for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex += 1) {
    const line = document.lineAt(lineIndex).text;

    if (!CLASS_LIKE_LINE_RE.test(line)) {
      continue;
    }

    AXO_CLASS_RE.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = AXO_CLASS_RE.exec(line))) {
      const className = match[0];

      if (registry.classMap.has(className)) {
        continue;
      }

      const range = new vscode.Range(
        lineIndex,
        match.index,
        lineIndex,
        match.index + className.length
      );
      const diagnostic = new vscode.Diagnostic(
        range,
        `Unknown Axoloth utility class: ${className}`,
        vscode.DiagnosticSeverity.Warning
      );
      diagnostic.code = UNKNOWN_AXOLOTH_CLASS_CODE;
      diagnostic.source = AXOLOTH_DIAGNOSTIC_SOURCE;
      result.push(diagnostic);
    }
  }

  diagnostics.set(document.uri, result);
}

export function createDiagnosticsScheduler(
  registry: AxolothRegistry,
  diagnostics: vscode.DiagnosticCollection
): (document: vscode.TextDocument) => void {
  const pending = new Map<string, NodeJS.Timeout>();

  return (document: vscode.TextDocument) => {
    const key = document.uri.toString();
    const existingTimeout = pending.get(key);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      pending.delete(key);
      validateDocument(document, registry, diagnostics);
    }, 300);

    pending.set(key, timeout);
  };
}
