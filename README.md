# Copy For LLM README

The Copy For LLM extension enhances your workflow when working with LLM chat interfaces by providing quick and easy ways to copy code and file contents with contextual information that LLMs can use to write better understand your code.

For example instead of copying this:

```
const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});
```

You can easily copy this code with a single shortcut instead:

```
src/test/suite/index.ts:
Lines 7-10:
const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});
```

## Features

### 1. Copy with File Metadata
Quickly copy selected text with the current filename and line numbers, encased in code block markdown syntax.
- Shortcut: `ctrl+alt+cmd+c`
- Command Palette: `Copy For LLM: With File Metadata`

![Copy For LLM With Filename](demo-assets/demoCopyWithFilename.gif)

### 2. Manage File List for Batch Copying
Create and manage a list of specific files for easy batch copying.
![Manage File List for Batch Copying](demo-assets/allfilescopyfinal.gif)

- Add a file to the list:
  - Right-click on a file in the explorer and select `Add to Copy For LLM File List`

- Copy contents of all files in the list:
  - Command Palette: `Copy For LLM: Copy All Specified File Contents`

- View and edit the file list:
  - Command Palette: `Copy For LLM: Open File List Settings`

### 3. Toggle Relative Path / Filename
Switch between using relative paths or just filenames in your copied content.
- Command Palette: `Copy For LLM: Toggle Relative Path / Filename`

### 4. Copy Entire File
Copy the entire contents of the current file with metadata.
- Command Palette: `Copy For LLM: Copy Entire File`

### 5. Copy All Files in Current Folder
Copy the contents of all files in the current folder with metadata.
- Command Palette: `Copy For LLM: Copy All Files in Current Folder`

## How These Features Improve Your Workflow

1. **Context-Rich Code Sharing**: Automatically include file names and line numbers when sharing code snippets with LLMs, providing crucial context for more accurate responses.

2. **Flexible Path Display**: Toggle between relative paths and filenames to suit your specific needs when discussing project structure with LLMs.

3. **Whole File Analysis**: Quickly share entire file contents for comprehensive code reviews or debugging sessions with LLMs.

4. **Folder-wide Code Sharing**: Easily provide LLMs with an overview of multiple files in a folder for project-wide analysis or refactoring suggestions.

5. **Customized File Batches**: Create and manage lists of specific files for repeated sharing with LLMs, perfect for ongoing discussions about particular parts of your project.

These features streamline the process of sharing code and project information with LLMs, saving time and ensuring that you provide the right context for more accurate and helpful responses.

## Release Notes

### 1.0.3

- Added new features for copying entire files, folders, and managing file lists for batch copying.

### 1.0.2

- Minor copied filepath improvement

### 1.0.1

- Initial release of Copy For LLM!

---
