# Context Management Presentation

This repo holds the source and training material for a slide deck on context engineering and AI coding agents.

## What's Here

- **src/presentation-revealjs/**: Multi-page Reveal.js-style HTML deck with shared CSS.
- **assets/theme-showcase.pdf**: Visual reference for the deck theme.
- **training/**: Short docs for installing Copilot CLI and the expected `.github` folder structure.
- **Overflow/**: Extra Claude Code-specific commands and archived prompts I no longer need, but want to keep nearby.

## Commands vs Prompts (Claude Code vs Copilot)

Claude Code "commands" and Copilot "prompts" are similar in spirit (both guide the assistant), but they are not the same thing. In this repo:

- **Copilot prompts** live under `.github/prompts/` and are reusable templates for workflows.
- **Claude Code commands** are kept under `Overflow/commands/` and reflect Claude Code-specific slash command definitions.

The `Overflow/` folder is intentionally outside `.github/` because it is not part of the active Copilot CLI configuration. It is a safe holding area for older Claude Code artifacts.

## Slides (Reveal.js Style)

- Entry point: [src/presentation-revealjs/index.html](src/presentation-revealjs/index.html)
- Slides: [src/presentation-revealjs/slides/](src/presentation-revealjs/slides/)
- Shared styles: [src/presentation-revealjs/theme.css](src/presentation-revealjs/theme.css)

Open the entry point in a browser. Each slide is its own HTML file with shared styling and keyboard navigation.