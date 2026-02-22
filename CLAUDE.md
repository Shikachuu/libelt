# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

libelt is a React 19 + TypeScript web application for discovering developer tools. It provides search, filtering, and pagination over a static JSON database of tools.

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start Vite dev server
pnpm run build        # TypeScript check + Vite production build
pnpm run preview      # Preview production build locally
pnpm lint             # Run Biome linter with auto-fix
```

## Architecture

**Tech Stack:** React 19, TypeScript 5.9, Vite 8 (beta), Tailwind CSS 4.2, Biome

**Key Files:**
- `src/App.tsx` - Main container managing search, filters, pagination state
- `src/tools.json` - Static tool database
- `src/types/tool.ts` - Tool interface definition
- `src/index.css` - Tailwind imports + theme CSS variables

**Components:**
- `SearchBox` - Text input with clear button
- `CategoryFilter` - Multi-select category pills
- `ToolCard` - Clickable card opening modal with tool details
- `ThemeToggle` - Dark/light mode toggle (persists to localStorage)

**State Management:** React hooks (useState, useMemo, useCallback). All state lives in App.tsx.

**Styling:** Tailwind utility classes with brutalist design theme (no border radius, monospace fonts). Theme colors defined as CSS custom properties in index.css.

## Code Style

Biome handles all linting and formatting:
- 2-space indentation, 100-char line width
- Double quotes, trailing commas, no semicolons
- Strict unused variable/parameter checking
- Import organization enabled

## Notes

- No test suite currently configured
- Uses pnpm as package manager (version 10.30.1)
- Node version managed via mise.toml (24.13.1)
