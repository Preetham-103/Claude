# ⚡ Sprint Tracker

A persistent, dark-themed work item tracker built as an interactive artifact inside [Claude.ai](https://claude.ai). No backend, no database, no sign-up — just open it and start tracking.

---

## 🧠 What is this?

Sprint Tracker is a lightweight agile work item manager that lives entirely inside a Claude.ai conversation. It uses Claude's built-in artifact storage to persist your data across sessions, meaning your items are saved automatically and waiting for you every time you return.

It was built iteratively through a conversation with Claude — designed, refined, and extended through natural language requests without writing a single line of code manually.

---

## ✨ Features

- **Add & manage work items** — capture ID, title, description, type, status, story points, and iteration details
- **Iteration grouping** — items are automatically grouped and displayed by sprint/iteration
- **Search** — full-text search across ID, title, and description
- **Filters** — filter by sprint, status, type, and date range
- **Story points validation** — checks if an iteration meets the minimum and maximum point thresholds, with a visual progress indicator
- **Excel export** — download a clean, client-ready `.xlsx` file for any iteration with one click
- **Persistent storage** — data is saved to Claude's artifact key-value storage and survives across sessions
- **Dark UI** — deep black background with a modern design system using DM Sans and DM Mono typography

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (functional components + hooks) |
| Styling | Inline styles + CSS-in-JS |
| Fonts | DM Sans, DM Mono (Google Fonts) |
| Excel Export | SheetJS (`xlsx`) |
| Storage | Claude Artifact Storage API (`window.storage`) |
| Runtime | Claude.ai Artifact Sandbox |

---

## 🚀 How to Access

1. Open [claude.ai](https://claude.ai)
2. Navigate to the pinned conversation containing this artifact
3. The tracker loads instantly with your saved data
4. Click the expand icon on the artifact panel for a full-screen experience

> **Tip:** Pin the conversation in your Claude.ai sidebar for one-click daily access.

---

## 📋 Work Item Fields

| Field | Description |
|---|---|
| Item ID | Unique identifier (e.g. `US-001`, `BUG-012`) |
| Title | Short description of the work item |
| Description | Detailed notes or acceptance criteria |
| Type | `Story`, `Bug`, or `Task` |
| Status | `To Do`, `In Progress`, or `Done` |
| Story Points | Fibonacci scale: 1, 2, 3, 5, 8, 13 |
| Iteration | Sprint name (e.g. `Sprint 1`) |
| Sprint Start / End | Date range for the iteration |
| Created Date | Date the item was logged |

---

## 📊 Excel Export

Clicking **⬇ Excel** on any iteration header downloads a `.xlsx` file containing:

- Item ID
- Title
- Type
- Story Points
- Iteration

One sheet, clean format — ready to share with stakeholders or clients.

---

## 💬 Built With Claude

This entire application was designed and built through a natural language conversation with **Claude (Sonnet 4.6)** on Claude.ai. Features were added, refined, and styled iteratively — no IDE, no terminal, no manual coding required.

---

*Powered by [Anthropic Claude](https://anthropic.com)*
