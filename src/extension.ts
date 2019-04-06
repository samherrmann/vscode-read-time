import {
  commands,
  ConfigurationChangeEvent,
  ExtensionContext,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  window,
  workspace
} from 'vscode';
import { Commands } from './models';
import { estimateReadTime, toggleEnableHandler } from './commands';
import { Logger } from './logging';

export function activate(context: ExtensionContext) {
  const { subscriptions } = context;
  subscriptions.push(
    commands.registerCommand(Commands.toggleEnable, toggleEnableHandler)
  );

  addSubscriptions(context);
}

function addSubscriptions({ subscriptions }: ExtensionContext) {
  subscriptions.push(Logger.getChannel());

  subscriptions.push(
    workspace.onDidChangeConfiguration((e: ConfigurationChangeEvent) => {
      estimateReadTime();
    })
  );

  subscriptions.push(
    window.onDidChangeActiveTextEditor((e: TextEditor | undefined) => {
      estimateReadTime();
    })
  );
  subscriptions.push(
    workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
      estimateReadTime();
    })
  );
  subscriptions.push(
    workspace.onDidOpenTextDocument((document: TextDocument) => {
      estimateReadTime();
    })
  );
}

export function deactivate() {}
