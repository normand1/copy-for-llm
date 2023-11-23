import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let customText = context.globalState.get('customText', '');

    let disposableCopyWithFilename = vscode.commands.registerCommand('copy-for-llm.copyWithFilename', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            try {
                const selectedText = editor.document.getText(editor.selection);
                const fileName = editor.document.fileName.split('/').pop();
    
                // Use the customText variable instead of fetching from settings
                const textToCopy = `${fileName}:\n \`\`\`${selectedText}\`\`\``;
    
                await vscode.env.clipboard.writeText(textToCopy);
                vscode.window.showInformationMessage('Custom text and selected text copied to clipboard');
            } catch (error) {
                console.error('Error writing to clipboard:', error);
                vscode.window.showErrorMessage('Failed to write to clipboard.');
            }
        } else {
            vscode.window.showErrorMessage('No active editor with selected text.');
        }
    });


    let disposableCopyWithCustomText = vscode.commands.registerCommand('copy-for-llm.copyWithCustomText', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            try {
                const selectedText = editor.document.getText(editor.selection);
                const fileName = editor.document.fileName.split('/').pop();
    
                // Use the customText variable instead of fetching from settings
                const textToCopy = `${customText}:\n \`\`\`${selectedText}\`\`\``;
    
                await vscode.env.clipboard.writeText(textToCopy);
                vscode.window.showInformationMessage('Custom text and selected text copied to clipboard');
            } catch (error) {
                console.error('Error writing to clipboard:', error);
                vscode.window.showErrorMessage('Failed to write to clipboard.');
            }
        } else {
            vscode.window.showErrorMessage('No active editor with selected text.');
        }
    });

let disposableSetCustomText = vscode.commands.registerCommand('copy-for-llm.setCustomText', async () => {
    // Prompt the user to enter custom text
    const input = await vscode.window.showInputBox({
        prompt: "Enter custom text to prepend",
        placeHolder: "Enter text here"
    });

    if (input !== undefined) {
        customText = input; // Update the custom text
        // Save the custom text to globalState
        context.globalState.update('customText', customText);
        vscode.window.showInformationMessage('Custom prepend text set successfully');
    }
});

    context.subscriptions.push(disposableCopyWithFilename, disposableSetCustomText);
}

export function deactivate() {}
