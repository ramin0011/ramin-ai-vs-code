import axios from "axios";
import * as vscode from "vscode";
import https from "https";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ramincode" is now active!');

  const disposable = vscode.commands.registerCommand(
    "ramincode.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from RaminCode!");
    }
  );

  let aiCommand = vscode.commands.registerCommand("extension.askAI", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (selectedText) {
        const prompt = await vscode.window.showInputBox({
          placeHolder: "Enter your prompt...",
        });

        if (prompt) {
          const fullText = `${prompt}\n\n${selectedText}`;

          try {
            const response = await axios.post(
              `http://localhost:5134/ai`,
              { input: fullText },
              {
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false,
                }),
              }
            );

            // Create a new text document and display the AI response
            const docContent = `Prompt:\n\n${prompt}\n\nSelected Text:\n\n${selectedText}\n\nAI Response:\n\n${response.data}`;
            const doc = await vscode.workspace.openTextDocument({
              content: docContent,
            });

            await vscode.window.showTextDocument(doc, {
              preview: false,
            });

          } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to contact AI: ${error.message}`);
          }
        } else {
          vscode.window.showWarningMessage("Prompt cannot be empty!");
        }
      } else {
        vscode.window.showWarningMessage("No text selected!");
      }
    }
  });

  context.subscriptions.push(aiCommand);
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
