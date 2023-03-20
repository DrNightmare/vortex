# Vortex - Code editing. Redefined, using GPT

Vortex is an open-source VS Code extension that uses the power of GPT to enhance and edit code directly within the VS Code editor. With Vortex, you can leverage the power of AI to write better code, faster.

## Requirements

To use Vortex, you will need:

- Visual Studio Code
- A valid OpenAI API key

You can fetch your OpenAI API key at https://platform.openai.com/account/api-keys.

## Getting Started

To get started with Vortex, simply install the extension from the VScode Marketplace. Once installed, Vortex will be available in the editor and can be used to generate, edit or review your code.

**NOTE**: This extension uses VS Code's Secret Storage to safely store API keys, and not in the user settings, which is something that is readable for all other extensions in the workspace.

## Setup

When the extension activates, you will see a prompt to enter your OpenAI API key, enter the key here and the extension will be ready to use.

## Usage

Vortex can help generate, edit or review code.

As an example, to use Vortex to edit code, follow these simple steps:

1. Select the code you want to edit in the editor. If you don't select anything, the entire file contents will be chosen as the selection. (Refer `Extension Settings` below to understand how to configure Vortex to not process too many lines).
2. Open the VScode Command Palette (press `Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Type `Vortex: Edit Code` and press enter to execute the command.
4. A prompt will appear asking you to describe the edits you want to make. Enter a brief description of the changes you want Vortex to make (e.g. `Add a docstring`), and press enter.

That's it! Vortex will automatically apply the requested edits, saving you time and effort. If you're not happy with the suggested edits, you can always modify your description and generate new suggestions until you find the changes you're looking for.

You can follow similar steps to use the `Generate Code` and `Review Code` commands.

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

Here are a few samples of commands followed by descriptions for common use cases:

**Generating code**: `Generate Code` -> `Util function to make API calls`

**Docstring generation**: `Edit Code` -> `Docstring` or `Add Docstring`.

**Refactoring**: `Edit Code` -> `Better variable names`.

**Code Reviews**: `Review Code`

## Extension Settings

This extension contributes the following settings:

- `vortex.maxLinesToProcess`: Use this to set the maximum number of lines to be processed. This is to make sure that you don't accidentally run this on a huge piece of code, which will end up using tokens from your OpenAI account.

---

## License

Vortex is licensed under the MIT License. See the LICENSE file for more information.

**Enjoy!**
