# 🚀 Exploring Claude Code Using a Real Microservices Project

## 🧠 Hands-on exploration of Claude Code capabilities using a real-world
full-stack microservices application
![AI](https://img.shields.io/badge/AI-Claude%20Code-blueviolet?style=for-the-badge)
![Exploration](https://img.shields.io/badge/Focus-Codebase%20Exploration-0aa2ff?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-success?style=for-the-badge)

------------------------------------------------------------------------

# 📖 About This Repository

This repository documents a **hands-on exploration of Claude Code**,
Anthropic's AI-powered coding assistant designed to work directly within
the **terminal and IDE**.

Instead of experimenting on small snippets, the exploration was
conducted on a **large real-world project** to better understand how
Claude Code handles:

-   Large codebases
-   Multi-file reasoning
-   UI debugging
-   Code architecture analysis
-   Autonomous code changes

The goal was to **learn Claude Code workflows and capabilities in a
realistic development environment.**

------------------------------------------------------------------------

# 🏗 Project Used for Exploration

The experiments were performed on a project called **BookHaven**, a
full-stack bookstore system built with a **microservices architecture**.

### Tech Stack

  Layer               Technology
  ------------------- ---------------------------
  Backend             Spring Boot Microservices
  Frontend            React + Vite
  API Gateway         Spring Cloud Gateway
  Service Discovery   Netflix Eureka
  Database            MySQL
  Communication       Feign Clients

The system includes **multiple backend services, gateway routing, and a
frontend SPA**, making it an ideal environment for Claude Code
experimentation.

------------------------------------------------------------------------

# 🔍 What I Explored with Claude Code

## ⚙️ 1. Repository Initialization (`/init`)

The exploration began by running the Claude Code command:

    /init

Claude automatically:

-   Scanned the entire repository
-   Read configuration files and build scripts
-   Identified service dependencies
-   Generated a **CLAUDE.md project context file**

This file acts as **persistent knowledge about the repository**,
allowing future sessions to start with full context.

------------------------------------------------------------------------

## 🧭 2. Understanding Application Flow

Claude analyzed the frontend execution flow across multiple files:

    main.jsx
       │
       ▼
    App.jsx
       │
       ▼
    Layouts & Route Guards
       │
       ▼
    Pages
       │
       ▼
    API Service Layer
       │
       ▼
    API Gateway
       │
       ▼
    Microservices
       │
       ▼
    Database

Instead of summarizing a single file, Claude built a **complete
architectural understanding of the system.**

------------------------------------------------------------------------

## 🖼 Screenshot-Based Debugging

A screenshot of the application UI was provided to Claude.

Claude was able to:

-   Diagnose empty UI sections
-   Trace the issue to missing backend data
-   Suggest fallback UI strategies
-   Implement temporary static content until APIs return data

This demonstrated Claude Code's ability to **map visual UI problems to
source code logic.**

------------------------------------------------------------------------

## 🧠 Plan Mode for Code Changes

When exploring UI improvements, Claude entered **Plan Mode**.

Workflow:

    Analyze Files
         ↓
    Identify Issues
         ↓
    Generate Implementation Plan
         ↓
    Wait for Approval
         ↓
    Execute Changes

This ensures **controlled modifications across large projects.**

------------------------------------------------------------------------

## 🛠 Multi-File Code Editing

Claude Code modified multiple files in a single session to implement
improvements such as:

-   UI layout fixes
-   CSS responsiveness improvements
-   Component styling consistency
-   Loading indicators
-   Page completion and styling updates

Claude also verified that the project still builds successfully after
applying changes.

------------------------------------------------------------------------

## 💾 Persistent Memory System

Claude Code supports **long-term memory across sessions**.

During the exploration:

-   Coding preferences were defined
-   Commenting guidelines were provided
-   Development style choices were recorded

Claude stored these preferences and automatically applied them in later
sessions.

------------------------------------------------------------------------

# ⭐ Key Claude Code Capabilities Observed

  Capability                   Description
  ---------------------------- ------------------------------------------
  📂 Full Codebase Awareness   Understands entire repositories
  🔗 Multi-File Reasoning      Connects logic across multiple files
  🧠 Autonomous Planning       Creates plans before modifying code
  🖼 Visual Debugging           Uses screenshots to diagnose UI issues
  🛠 Multi-File Editing         Applies coordinated changes across files
  💾 Persistent Memory         Remembers developer preferences
  ✔ Self Verification          Ensures builds succeed after changes

Claude Code behaves more like a **development agent** than a traditional
code completion tool.

------------------------------------------------------------------------

# 🎯 Purpose of This Repository

This repository serves as a **learning journal for exploring Claude Code
in a real project environment.**

The focus is not the bookstore application itself, but rather **how
Claude Code interacts with and improves an existing codebase.**

------------------------------------------------------------------------

# 🗓 Session Information

**Exploration Date**\
📅 05 April 2026

**Environment**

-   Claude Code (claude-sonnet-4-6)
-   VS Code
-   Terminal-based workflow

------------------------------------------------------------------------

✨ Experimenting with AI-assisted development workflows using Claude
Code

