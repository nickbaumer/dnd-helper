// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { conditions } from './conditions';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// try to display a hover window
	vscode.languages.registerHoverProvider('markdown', {
		provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range)?.toLowerCase();
			let result = conditions.find((condition: { name: string; }) => condition.name === word);
			if (result) {
				const markdown = new vscode.MarkdownString()
				markdown.appendMarkdown(`**[${result?.displayName}](https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#${result.displayName})**`)
				markdown.appendText("\n")
				markdown.appendMarkdown(`${result?.description}`);
				return new vscode.Hover(markdown);
			}
		}
	});

	context.subscriptions.push(vscode.commands.registerCommand('dnd-condition-helper.quickPick', async () => {
		const quickPick = vscode.window.createQuickPick();
		// set the items to the conditions array
		quickPick.items = conditions.map(condition => ({ label: condition.displayName, detail: condition.description })) 
		quickPick.onDidChangeSelection(selection => {
			// launch url to dndbeyond
			if (selection[0]) {
				vscode.env.openExternal(vscode.Uri.parse(`https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#${selection[0].label}`));
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	}));
}

// This method is called when your extension is deactivated
export function deactivate() { }
