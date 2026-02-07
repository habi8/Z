# Z — Global-Ready Notion-Lite Workspace
Demo : https://drive.google.com/file/d/1h50Xq--csZOEs2Z5UtW1v3DdEDPrP2Wr/view?usp=drive_link

Z is a lightweight, Notion-inspired collaborative workspace application built with a strong focus on internationalization, localization correctness, and scalable SaaS architecture.

Unlike typical productivity apps that treat localization as an afterthought, Z is designed to be global-ready from day one by combining runtime i18n with compile-time localization enforcement using Lingo.dev.

## Introduction

Z allows users to create workspaces, manage pages, and collaboratively edit documents through a minimal block editor. Team members can be invited via email using a workspace link and collaborate seamlessly.

The core goal of Z is to demonstrate how modern developer tooling can turn localization from a manual, error-prone task into an automated, enforceable part of the development workflow.

## Key Features

- Email-based authentication using Supabase
- Workspace creation, renaming, and deletion
- Shareable workspace invite links for collaboration
- Page management inside workspaces
- Minimal block editor (Text and Heading blocks)
- Runtime language switching
- Localization-safe architecture with compile-time guarantees

## Tech Stack

- Next.js (App Router)
- React
- TypeScript (strict)
- Supabase (Auth + Database)
- Runtime i18n (next-intl)
- Lingo.dev (CLI + Compiler + MCP )
- github actions
- Tailwind CSS

## Project Structure

```text
Z/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ i18n/
│     ├─ config.ts
│     └─ provider.tsx
├─ components/
│  ├─ Editor.tsx
│  └─ Toolbar.tsx
├─ lib/
│  ├─ supabase.ts
│  └─ lingo.ts
├─ public/
│  └─ logo.svg
├─ messages/
│  ├─ en.json
│  └─ bn.json
└─ README.md
```


## Internationalization vs Localization

Z clearly separates responsibilities:

- Runtime i18n handles language switching and rendering translated strings.
- Localization correctness is enforced at compile time using Lingo.dev.

All user-facing text is referenced through translation keys. No hardcoded UI strings are allowed.

## Lingo.dev Integration

Lingo.dev is used to enforce localization as infrastructure, not as a manual process.

Lingo.dev CLI
- Extracts user-facing strings from the codebase
- Keeps translation files in sync
- Supports adding new languages safely

Lingo.dev Compiler
- Runs at build time
- Fails the build if translations are missing or invalid
- Prevents hardcoded strings
- Detects unused translation keys

CI/CD Readiness
- Localization checks are designed to run in CI
- Prevents localization regressions before deployment

Lingo.dev complements runtime i18n by providing compile-time guarantees that the application is fully and correctly localized.

## Adding New Languages

Z starts with two languages, but the architecture supports adding more languages at any time.

When a new language is added:
- Translation files are generated and validated
- All keys are guaranteed to exist
- No UI refactoring is required

## Why This Project

Z demonstrates:
- Real-world SaaS collaboration patterns
- Correct separation of runtime and compile-time responsibilities
- Scalable localization architecture
- Strong execution with controlled scope

This project shows how global-ready applications should be built using modern developer tooling.

## Getting Started

1. Clone the repository
2. Install dependencies
3. Configure Supabase environment variables
4. Run the development server
5. Optionally install and run Lingo.dev locally to enforce localization checks

