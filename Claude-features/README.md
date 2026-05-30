# ⚡ Claude Features

This folder contains everything that extends and customizes how Claude behaves — custom **Skills**, interactive **Artifacts**, and **Slash Commands** for Claude Code.

---

## 📁 Folder Structure

```
Claude-features/
├── Skills/              # Custom skill definitions for Claude
├── Artifacts/           # Interactive tools built as Claude Artifacts
└── Slash-Commands/      # Custom slash commands for Claude Code
```

---

## 🧠 Skills

Skills are instruction files that teach Claude how to handle specific tasks. When a relevant request is detected, Claude loads the skill and follows its guidance to produce better, more targeted output.

### Skills in this repo

| Skill | What it does |
|---|---|
| `requirement-analyzar` | Parses Azure DevOps user stories into business objectives, functional requirements, acceptance criteria, and edge cases |
| `bug-log-analyzer` | Analyzes logs and stack traces to identify root cause and suggest actionable fixes |
| `ExternalRequestValidator` | Validates JSON payloads against the External API schema |
| `schema-validator` | Validates JSON payloads — syntax + business logic checks |

### How to use a skill
Each skill folder contains a `SKILL.md` file. To use a skill in Claude:
1. Copy the skill folder to `~/.claude/skills/` (for Claude Code)
2. Or reference the skill path in your Claude project settings

---

## 🎨 Artifacts

Artifacts are standalone interactive tools rendered directly inside Claude's chat interface. They are built with React or HTML/CSS/JS and can persist data across sessions.

### Artifacts in this repo

| Artifact | Description |
|---|---|
| `Work Tracker` | A persistent task tracker for managing work items, built as a React artifact with storage support |

### How to use an artifact
Paste the artifact code directly into a Claude conversation — Claude will render it as an interactive tool in the chat.

---

## ⚡ Slash Commands

Slash commands are shortcuts used inside **Claude Code** to trigger specific workflows without typing long instructions every time.

### How to use slash commands
Place the command files in your project's `.claude/commands/` directory. Then invoke them inside Claude Code with `/command-name`.

---

## 💡 Tips

- Skills work best when their trigger descriptions are precise — if Claude isn't picking up a skill automatically, refine the `description` field in the skill's frontmatter.
- Artifacts with `window.storage` can persist data across sessions — useful for trackers and dashboards.
- Slash commands pair well with hooks for fully automated workflows.
