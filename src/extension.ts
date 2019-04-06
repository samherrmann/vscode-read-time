import * as readingTime from 'reading-time';

import * as vscode from 'vscode';
import { StatusBarItem, TextDocument, window, workspace } from 'vscode';
import { Commands } from './models';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "read-time" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand(
      Commands.estimateReadTime,
      estimateReadTimeHandler
    )
  );

  workspace.onDidChangeTextDocument(handleDocChanges);
  vscode.window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor);
  vscode.workspace.onDidOpenTextDocument(handleDocOpen);
  vscode.workspace.onDidCloseTextDocument(handleDocClose);

  // todo: need an on activate ?
}

function handleChangeActiveTextEditor(e: vscode.TextEditor | undefined) {
  estimateReadTimeHandler();
}
function handleDocClose(document: TextDocument) {
  clearStatusBar();
}
function handleDocOpen(document: TextDocument) {
  estimateReadTimeHandler();
}

function handleDocChanges(e: vscode.TextDocumentChangeEvent) {
  estimateReadTimeHandler();
}

export function deactivate() {}

let statusBarItem: StatusBarItem;

function getCurrentTextEditor() {
  let editor = window.activeTextEditor;
  if (!editor) {
    statusBarItem.hide();
    return;
  }
  return editor;
}

function estimateReadTimeHandler() {
  if (!statusBarItem) {
    statusBarItem = window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  }

  let editor = getCurrentTextEditor();
  if (!editor) {
    return;
  }
  const { document } = editor;

  updateStatusBar(document);
}

function clearStatusBar() {
  statusBarItem.text = '';
  statusBarItem.hide();
}

function updateStatusBar(document: TextDocument) {
  if (document.languageId === 'markdown') {
    const textToRead = document.getText();
    const { text, minutes, time, words } = getReadingTime(textToRead);
    statusBarItem.text = `$(book) ${text}`;
    statusBarItem.show();
  } else {
    clearStatusBar();
  }
}

function getReadingTime(textToRead: string) {
  const readingData = readingTime(textToRead);
  const { text, minutes, time, words } = readingData;
  // vscode.window.showInformationMessage(`${text}`);
  return readingData;
}