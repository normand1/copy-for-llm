import * as vscode from 'vscode';
const path = require('path');
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

    let toggleRelativePath = context.globalState.get('toggleRelativePath', true);

    let customText = context.globalState.get('customText', '');

    let disposableCopyEntireFile = vscode.commands.registerCommand('copy-for-llm.copyEntireFile', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
    
        if (editor) {
            try {
                // Get the entire file content
                const entireFileContent = editor.document.getText();
                const fullPath = editor.document.fileName;
                const fileName = path.basename(fullPath);
    
                // Get the workspace folder
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(fullPath));
                
                // Format text with file metadata
                let textToCopy = '';
                if (toggleRelativePath && workspaceFolder) {
                    const relativePath = path.relative(workspaceFolder.uri.fsPath, fullPath);
                    textToCopy = `${relativePath}:\n`;
                } else {
                    textToCopy = `${fileName}:\n`;
                }
                
                textToCopy += `\`\`\`\n${entireFileContent}\n\`\`\``;
    
                await vscode.env.clipboard.writeText(textToCopy);
                vscode.window.showInformationMessage('Entire file content with metadata copied to clipboard');
            } catch (error) {
                console.error('Error writing to clipboard:', error);
                vscode.window.showErrorMessage('Failed to write to clipboard.');
            }
        } else {
            vscode.window.showErrorMessage('No active editor.');
        }
    }); 

    let disposableCopyWithFilename = vscode.commands.registerCommand('copy-for-llm.copyWithFilename', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
    
        if (editor) {
            try {
                // Get the selected text
                const selectedText = editor.document.getText(editor.selection);
                const fullPath = editor.document.fileName;
                const fileName = path.basename(fullPath);
    
                // Get the workspace folder
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(fullPath));
                
                // Get line numbers
                const startLine = editor.selection.start.line + 1; // Adding 1 to make it 1-indexed
                const endLine = editor.selection.end.line + 1;
    
                // Format text with line numbers
                let textToCopy = '';
                if (toggleRelativePath && workspaceFolder) {
                    const relativePath = path.relative(workspaceFolder.uri.fsPath, fullPath);
                    textToCopy = `${relativePath}:\n`;
                } else {
                    textToCopy = `${fileName}:\n`;
                }
                
                if (startLine === endLine) {
                    textToCopy += `Line ${startLine}:\n\`\`\`${selectedText}\`\`\``;
                } else {
                    textToCopy += `Lines ${startLine}-${endLine}:\n\`\`\`${selectedText}\`\`\``;
                }
    
                await vscode.env.clipboard.writeText(textToCopy);
                vscode.window.showInformationMessage('Filename, line numbers, and selected text copied to clipboard');
            } catch (error) {
                console.error('Error writing to clipboard:', error);
                vscode.window.showErrorMessage('Failed to write to clipboard.');
            }
        } else {
            vscode.window.showErrorMessage('No active editor with selected text.');
        }
    });
    
    let disposableToggleRelativePath = vscode.commands.registerCommand('copy-for-llm.toggleRelativePath', async () => {
        const oldValue = toggleRelativePath;
        toggleRelativePath = !oldValue;
        context.globalState.update('toggleRelativePath', toggleRelativePath);
        const message = oldValue ? 'Relative path pre-pending disabled.' : 'Relative path pre-pending enabled.';
        vscode.window.showInformationMessage(message);
      });

    let disposableCopyWithCustomText = vscode.commands.registerCommand('copy-for-llm.copyWithCustomText', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            try {
                const toggleRelativePath = context.globalState.get('toggleRelativePath', true);
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

    let disposableCopyAllFilesInFolder = vscode.commands.registerCommand('copy-for-llm.copyAllFilesInFolder', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor.');
            return;
        }

        const currentFilePath = editor.document.uri.fsPath;
        const currentFolder = path.dirname(currentFilePath);
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(currentFilePath));

        try {
            const files = fs.readdirSync(currentFolder);
            let allFileContents = '';

            for (const file of files) {
                const filePath = path.join(currentFolder, file);
                const stats = fs.statSync(filePath);

                if (stats.isFile()) {
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    let fileMetadata = '';

                    if (toggleRelativePath && workspaceFolder) {
                        const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
                        fileMetadata = `${relativePath}:\n`;
                    } else {
                        fileMetadata = `${file}:\n`;
                    }

                    allFileContents += `${fileMetadata}\`\`\`\n${fileContent}\n\`\`\`\n\n`;
                }
            }

            await vscode.env.clipboard.writeText(allFileContents);
            vscode.window.showInformationMessage('All file contents with metadata copied to clipboard');
        } catch (error) {
            console.error('Error reading files or writing to clipboard:', error);
            vscode.window.showErrorMessage('Failed to copy files to clipboard.');
        }
    });

    context.subscriptions.push(
        disposableCopyWithFilename, 
        disposableSetCustomText, 
        disposableCopyWithCustomText, 
        disposableToggleRelativePath,
        disposableCopyEntireFile,
        disposableCopyAllFilesInFolder 
    );
}

export function deactivate() {}
