// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "ramincode" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "ramincode.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from RaminCode!");
    }
  );

  let aiCommand = vscode.commands.registerCommand(
    "extension.askAI",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (selectedText) {
          try {
            const response = await axios.post(`https://localhost:7116/ai`, {
              input: selectedText,
            });
            vscode.window.showInformationMessage(
              `AI Response: ${response.data}`
            );
          } catch (error: any) {
            vscode.window.showErrorMessage(
              `Failed to contact AI: ${error.message}`
            );
          }
        } else {
          vscode.window.showWarningMessage("No text selected!");
        }
      }
    }
  );

  context.subscriptions.push(aiCommand);

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
