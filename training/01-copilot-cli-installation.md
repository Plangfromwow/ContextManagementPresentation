# Installing GitHub Copilot CLI

This guide covers how to install and get started with GitHub Copilot CLI.

---

## Prerequisites

- **PowerShell v6 or higher** (on Windows)
- **An active GitHub Copilot subscription** - See [Copilot plans](https://github.com/features/copilot/plans)

---

## Installation Methods

### Option 1: NPM (Recommended for cross-platform)

```bash
# Install stable version
npm install -g @github/copilot

# Install prerelease version
npm install -g @github/copilot@prerelease
```

### Option 2: WinGet (Windows)

```bash
# Stable
winget install GitHub.Copilot

# Prerelease
winget install GitHub.Copilot.Prerelease
```

### Option 3: Homebrew (macOS/Linux)

```bash
# Stable
brew install copilot-cli

# Prerelease
brew install copilot-cli@prerelease
```

### Option 4: Install Script (macOS/Linux)

```bash
curl -fsSL https://gh.io/copilot-install | bash
# or
wget -qO- https://gh.io/copilot-install | bash
```

---

## Launching Copilot CLI

After installation, simply run:

```bash
copilot
```

On first launch:
1. You'll see an animated banner
2. If not logged in, use the `/login` command to authenticate with GitHub

---

## Authentication Options

### Option A: Browser-based Login
1. Run `copilot`
2. Use the `/login` slash command
3. Follow the on-screen instructions to authenticate via browser

### Option B: Personal Access Token (PAT)
1. Go to https://github.com/settings/personal-access-tokens/new
2. Under "Permissions", add the **"Copilot Requests"** permission
3. Generate the token
4. Set as environment variable: `GH_TOKEN` or `GITHUB_TOKEN`

---

## Key Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show all available commands |
| `/login` | Log in to Copilot |
| `/logout` | Log out of Copilot |
| `/model` | Select AI model (Claude Sonnet 4.5, GPT-5, etc.) |
| `/clear` | Clear conversation history |
| `/exit` | Exit the CLI |
| `/init` | Initialize Copilot instructions for a repository |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `@` | Mention files to include in context |
| `Ctrl+X → /` | Run command |
| `Esc` | Cancel current operation |
| `!` | Execute command in local shell (bypass Copilot) |
| `Ctrl+C` | Cancel / clear input / exit |
| `Ctrl+L` | Clear the screen |

---

## Instruction Files

Copilot CLI reads instructions from these locations (in order):

1. `CLAUDE.md` / `GEMINI.md` / `AGENTS.md` (in git root & cwd)
2. `.github/instructions/**/*.instructions.md`
3. `.github/copilot-instructions.md`
4. `$HOME/.copilot/copilot-instructions.md`
5. Directories specified in `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` env var

---

## Next Steps

See the companion document **"02-github-folder-structure.md"** for how this repo organizes the `.github` folder.

In this repo, the `.github` layout includes:

- `agents/`
- `prompts/`
- `skills/`
- `copilot-instructions.md`
