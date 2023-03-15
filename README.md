# Vortex - Code editing. Redefined, using GPT

Vortex is an open-source VS Code extension that uses the power of GPT to enhance and edit code directly within the VS Code editor. With Vortex, you can leverage the power of AI to write better code, faster.

## Getting Started

To get started with Vortex, simply install the extension from the VScode Marketplace. Once installed, Vortex will be available in the editor and can be used to enhance and edit your code.

## Usage

To use Vortex, follow these simple steps:

1. Select the code you want to edit in the editor.
2. Open the VScode Command Palette (press `Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Type `Vortex: Edit Code` and press enter to execute the command.
4. A prompt will appear asking you to describe the edits you want to make. Enter a brief description of the changes you want Vortex to make (e.g. `Add a docstring`), and press enter.

That's it! Vortex will automatically apply the requested edits, saving you time and effort. If you're not happy with the suggested edits, you can always modify your description and generate new suggestions until you find the changes you're looking for.

## Example

Assume you have the following function:

```python
def get_grade(score):
    if score >= 90:
        grade = 'A'
    elif score >= 80:
        grade = 'B'
    elif score >= 70:
        grade = 'C'
    else:
        grade = 'D'
    return grade
```

After performing a `Vortex: Edit Code` followed by the edit description: `Use dict instead of if else`, Vortex automatically updates the code to:

```python
def get_grade(score):
    grade = {
        score >= 90: 'A',
        score >= 80: 'B',
        score >= 70: 'C',
        True: 'D'
    }
    return grade[True]
```

## Use cases

Here are a few edit descriptions for common use cases:

**Docstring generation** -> `Docstring` or `Add Docstring`.

**Refactoring** -> `Better variable names`.

## Requirements

To use Vortex, you will need:

- Visual Studio Code
- A valid OpenAI API key

**Note: WIP - there will be a way to input API Key to activate the extension**

You can fetch your OpenAI API key at https://platform.openai.com/account/api-keys.

// update with notes on how to set the API key once this is live

## Extension Settings

This extension contributes the following settings:

- `vortex.maxLinesToProcess`: Use this to set the maximum number of lines to be processed. This is to make sure that you don't accidentally run this on a huge piece of code, which will end up using tokens from your OpenAI account.

## Known Issues

- Currently there is no way to input API key to use the extension, this will be the first item to fix.

## Release Notes

### 0.1.0

First version.

---

## License

Vortex is licensed under the MIT License. See the LICENSE file for more information.

**Enjoy!**
