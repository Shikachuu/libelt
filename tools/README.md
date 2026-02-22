# Tools Directory

This directory contains the tool data for libelt, organized as individual JSON files validated against a JSON Schema.

## Adding New Tools

Create or edit any `*.json` file in this directory (except `schema.json`). Each file can contain either a single tool object or an array of tools.

**Single Tool:**
```json
{
  "$schema": "./schema.json",
  "name": "React",
  "description": "A JavaScript library for building user interfaces with component-based architecture",
  "categories": ["Frontend", "UI Framework"],
  "github": "https://github.com/facebook/react"
}
```

**Multiple Tools:**
```json
[
  {
    "$schema": "./schema.json",
    "name": "React",
    "description": "A JavaScript library for building user interfaces",
    "categories": ["Frontend"],
    "github": "https://github.com/facebook/react"
  }
]
```

## Validation Rules

- **name**: 1-100 characters, must be unique (case-insensitive)
- **description**: 10-500 characters
- **categories**: 1-10 unique strings (each 1-50 characters)
- **github**: Must match `https://github.com/org/repo` format

The `$schema` property is optional (for IDE validation) and will be stripped during generation.

## Generating Tool Data

### Automatic
Runs automatically during `pnpm dev` and `pnpm build`. Hot-reloads when you edit any `*.json` file.

### Manual
```bash
pnpm generate
```

This validates all tools and generates `src/tools.json` and `src/types/tool.ts`.

## Generated Files

- `src/tools.json` - Combined tool data (gitignored, don't edit)
- `src/types/tool.ts` - TypeScript types (committed, don't edit)
