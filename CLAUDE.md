# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

libelt is a React 19 + TypeScript web application for discovering developer tools. It provides fuzzy search (Fuse.js), filtering, and pagination over an auto-generated JSON database of tools.

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start Vite dev server (auto-generates tools)
pnpm run build        # TypeScript check + Vite production build
pnpm run preview      # Preview production build locally
pnpm run generate     # Manually regenerate tool data from tools/*.json
pnpm lint             # Run Biome linter with auto-fix
```

## Architecture

**Tech Stack:** React 19, TypeScript 5.9, Vite 8 (beta), Tailwind CSS 4.2, Biome 2.4, Fuse.js

**Key Directories:**
- `src/` - React application source
- `tools/` - Tool data source files (JSON) and schema
- `scripts/` - Build and generation scripts
- `vite-plugins/` - Custom Vite plugin for auto-generation

**Key Files:**
- `src/App.tsx` - Main container managing search, filters, pagination state
- `src/tools.json` - Auto-generated tool database (gitignored)
- `src/types/tool.ts` - Auto-generated TypeScript types from schema
- `src/index.css` - Tailwind imports + theme CSS variables
- `tools/schema.json` - JSON Schema for tool validation

**Components:**
- `SearchBox` - Text input with clear button
- `CategoryFilter` - Multi-select category pills with expand/collapse
- `ToolCard` - Clickable card opening modal with tool details
- `ThemeToggle` - Dark/light mode toggle (persists to localStorage)
- `ResultsCounter` - Displays filtered vs total tool count
- `SubmitToolButton` - Modal with PR submission instructions

**State Management:** React hooks (useState, useMemo, useCallback). All state lives in App.tsx.

**Styling:** Tailwind utility classes with brutalist design theme (no border radius, monospace fonts). Theme colors defined as CSS custom properties in index.css.

## Tool Data Pipeline

Tools are defined in `tools/*.json` files (golang.json, typescript.json, rust.json, etc.) and validated against `tools/schema.json` using AJV.

The generation script (`scripts/lib/generate.ts`):
1. Reads all `tools/*.json` files
2. Validates against schema
3. Checks for duplicate tool names
4. Generates `src/tools.json` and `src/types/tool.ts`

This runs automatically via a custom Vite plugin on `dev` and `build`.

**Adding a new tool:** Add to an existing `tools/*.json` file or create a new category file following the schema.

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- **CI** (`ci.yml`) - Runs on PRs: lint, build, CodeQL security analysis
- **CD** (`cd.yml`) - Runs on main push: deploys to GitHub Pages

## Validation Rules

Every change must pass these checks before committing:

```bash
pnpm lint             # Biome linting and formatting
pnpm build            # TypeScript type-check + production build
```

## Notes

- No test suite currently configured
- Uses pnpm as package manager (version 10.30.1)
- Node version managed via mise.toml (24.13.1)
- Generated files (`src/tools.json`, `public/schemas/**`) are gitignored
