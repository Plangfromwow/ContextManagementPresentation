# Context Management Presentation

This repo holds the source and training material for a slide deck on context engineering and AI coding agents. The main output is a PowerPoint presentation generated via Node.js.

## What's Here

- **src/create-presentation.js**: The slide deck generator built with PptxGenJS and React server rendering.
- **presentations/Context-Engineering-Presentation.pptx**, **presentations/Context-Engineering-Presentation-v2.pptx**, and **presentations/Context-Engineering-Presentation-v3.pptx**: Generated presentation files.
- **assets/theme-showcase.pdf**: Visual reference for the deck theme.
- **training/**: Short docs for installing Copilot CLI and the expected `.github` folder structure.
- **Overflow/**: Extra Claude Code-specific commands and archived prompts I no longer need, but want to keep nearby.

## Commands vs Prompts (Claude Code vs Copilot)

Claude Code "commands" and Copilot "prompts" are similar in spirit (both guide the assistant), but they are not the same thing. In this repo:

- **Copilot prompts** live under `.github/prompts/` and are reusable templates for workflows.
- **Claude Code commands** are kept under `Overflow/commands/` and reflect Claude Code-specific slash command definitions.

The `Overflow/` folder is intentionally outside `.github/` because it is not part of the active Copilot CLI configuration. It is a safe holding area for older Claude Code artifacts.

## Running the Generator

The generator is the entry point for creating the PPTX. It writes to [presentations/](presentations/) from [src/create-presentation.js](src/create-presentation.js).

1. Install dependencies: `npm install`
2. Run the generator: `node src/create-presentation.js`

Update the output path in the script if you want the file written somewhere else.