import * as vscode from 'vscode';
import { createCompletionProvider } from './completions';
import { createDiagnosticsScheduler, isSupportedDocument, validateDocument } from './diagnostics';
import { createHoverProvider } from './hovers';
import { loadRegistry } from './data';

const DOCUMENT_SELECTOR: vscode.DocumentSelector = [
  { language: 'html', scheme: 'file' },
  { language: 'html', scheme: 'untitled' },
  { language: 'css', scheme: 'file' },
  { language: 'css', scheme: 'untitled' },
  { language: 'javascriptreact', scheme: 'file' },
  { language: 'javascriptreact', scheme: 'untitled' },
  { language: 'typescriptreact', scheme: 'file' },
  { language: 'typescriptreact', scheme: 'untitled' },
  { language: 'vue', scheme: 'file' },
  { language: 'vue', scheme: 'untitled' },
  { language: 'svelte', scheme: 'file' },
  { language: 'svelte', scheme: 'untitled' },
  { language: 'astro', scheme: 'file' },
  { language: 'astro', scheme: 'untitled' },
];

export function activate(context: vscode.ExtensionContext): void {
  const registry = loadRegistry(context.extensionPath);
  const diagnostics = vscode.languages.createDiagnosticCollection('axoloth-intellisense');
  const scheduleDiagnostics = createDiagnosticsScheduler(registry, diagnostics);

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      DOCUMENT_SELECTOR,
      createCompletionProvider(registry),
      '-'
    ),
    vscode.languages.registerHoverProvider(DOCUMENT_SELECTOR, createHoverProvider(registry)),
    diagnostics,
    vscode.workspace.onDidOpenTextDocument((document) => {
      if (isSupportedDocument(document)) {
        scheduleDiagnostics(document);
      }
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (isSupportedDocument(event.document)) {
        scheduleDiagnostics(event.document);
      }
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      diagnostics.delete(document.uri);
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('axolothIntelliSense.diagnostics.enabled')) {
        vscode.workspace.textDocuments.forEach((document) => {
          validateDocument(document, registry, diagnostics);
        });
      }
    })
  );

  vscode.workspace.textDocuments.forEach((document) => {
    if (isSupportedDocument(document)) {
      scheduleDiagnostics(document);
    }
  });
}

export function deactivate(): void {
  // VS Code disposes registered subscriptions automatically.
}
