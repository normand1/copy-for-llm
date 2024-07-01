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

    let disposableAddFileToList = vscode.commands.registerCommand('copy-for-llm.addFileToList', async (uri: vscode.Uri) => {
        if (uri && uri.fsPath) {
            const config = vscode.workspace.getConfiguration('copyForLLM');
            const filePaths = config.get<string[]>('filePaths', []);
            
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
            let relativePath = uri.fsPath;
            
            if (workspaceFolder) {
                relativePath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
            }
            
            if (!filePaths.includes(relativePath)) {
                filePaths.push(relativePath);
                await config.update('filePaths', filePaths, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Added ${relativePath} to Copy For LLM file list`);
            } else {
                vscode.window.showInformationMessage(`${relativePath} is already in the Copy For LLM file list`);
            }
        }
    });

    let disposableCopyAllFileContents = vscode.commands.registerCommand('copy-for-llm.copyAllFileContents', async () => {
        const config = vscode.workspace.getConfiguration('copyForLLM');
        const filePaths = config.get<string[]>('filePaths', []);

        if (filePaths.length === 0) {
            vscode.window.showWarningMessage('No files in the Copy For LLM list. Right-click on files and select "Add to Copy For LLM File List" to add them.');
            return;
        }

        let allFileContents = '';
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

        for (const filePath of filePaths) {
            try {
                const fullPath = path.isAbsolute(filePath) 
                    ? filePath 
                    : workspaceFolder 
                        ? path.join(workspaceFolder.uri.fsPath, filePath)
                        : filePath;

                const fileContent = fs.readFileSync(fullPath, 'utf8');
                let fileMetadata = '';

                if (toggleRelativePath && workspaceFolder) {
                    const relativePath = path.relative(workspaceFolder.uri.fsPath, fullPath);
                    fileMetadata = `${relativePath}:\n`;
                } else {
                    fileMetadata = `${path.basename(fullPath)}:\n`;
                }

                allFileContents += `${fileMetadata}\`\`\`\n${fileContent}\n\`\`\`\n\n`;
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
                vscode.window.showErrorMessage(`Failed to read file: ${filePath}`);
            }
        }

        if (allFileContents) {
            await vscode.env.clipboard.writeText(allFileContents);
            vscode.window.showInformationMessage('All specified file contents copied to clipboard');
        } else {
            vscode.window.showErrorMessage('No file contents were copied to clipboard');
        }
    });

    let disposableOpenFileListSettings = vscode.commands.registerCommand('copy-for-llm.openFileListSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'copyForLLM.filePaths');
    });


    context.subscriptions.push(
        disposableCopyWithFilename, 
        disposableSetCustomText, 
        disposableCopyWithCustomText, 
        disposableToggleRelativePath,
        disposableCopyEntireFile,
        disposableCopyAllFilesInFolder,
        disposableCopyAllFileContents,
        disposableAddFileToList,
        disposableOpenFileListSettings
    );
}

export function deactivate() {}
