# Copy For LLM README

The copy-for-llm extension simply formats code that is copied to your pasteboard in a way that gives an LLM some context on the file that the code is referenced from.

## Features

The main feature of this extension is to: 
- Prefix the selected text with the current filename 
- Include the line numbers for the selected code
- Encase selected text with code block markdown syntax.
In this way you can quickly give the LLM context around which file you are working in.

Example:
```
extension.ts:
Lines 65-68:
```const input = await vscode.window.showInputBox({
        prompt: "Enter custom text to prepend",
        placeHolder: "Enter text here"
    });```
```

Select the text you want to copy over to your LLM chat interface and press `ctr+opt+cmd+c` or select `Copy For LLM: Copy with Filename` from the VSCode Command Palette.

![Copy For LLM With Filename](demo-assets/demoCopyWithFilename.gif)

## Release Notes

### 1.0.0

Initial release of Copy For LLM!

### 1.0.1

Initial release of Copy For LLM!

---
