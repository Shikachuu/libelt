# Tools Directory

This directory contains the tool data for libelt, organized as individual JSON files validated against a JSON Schema.

## Adding New Tools

Create or edit any `*.json` file in this directory (except `schema.json`). All files must use the collection format with a `tools` array:

```json
{
  "$schema": "./schema.json",
  "tools": [
    {
      "name": "React",
      "description": "A JavaScript library for building user interfaces with component-based architecture",
      "categories": ["Frontend", "UI Framework"],
      "github": "https://github.com/facebook/react"
    },
    {
      "name": "Vue",
      "description": "Progressive JavaScript framework for building user interfaces",
      "categories": ["Frontend", "UI Framework"],
      "github": "https://github.com/vuejs/vue"
    }
  ]
}
```

The `$schema` property enables IDE autocomplete and validation.

## Validation Rules

Each tool must have:

- **name**: 1-100 characters, must be unique (case-insensitive)
- **description**: 10-500 characters
- **categories**: 1-10 unique strings (each 1-50 characters)
- **github**: Must match `https://github.com/org/repo` format

## Generating Tool Data

### Automatic
Runs automatically during `pnpm dev` and `pnpm build`. Hot-reloads when you edit any `*.json` file.

### Manual
```bash
pnpm generate
```

This validates all tools and generates:
- `src/tools.json` - Combined tool data (gitignored, don't edit)
- `src/types/tool.ts` - TypeScript types (committed, don't edit)
- `public/schemas/tool-collection.json` - Schema for public access
