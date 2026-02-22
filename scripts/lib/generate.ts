import Ajv from "ajv"
import addFormats from "ajv-formats"
import { compile } from "json-schema-to-typescript"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import glob from "fast-glob"

interface Tool {
  name: string
  description: string
  categories: string[]
  github: string
}

interface GenerateResult {
  success: boolean
  toolCount: number
  errors?: string[]
}

interface GenerateOptions {
  verbose?: boolean
}

export async function generateTools(
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  const { verbose = false } = options
  const errors: string[] = []

  try {
    if (verbose) console.log("🔧 Generating tools...")

    // Load schema
    const schemaPath = join(process.cwd(), "tools/schema.json")
    const schemaContent = await readFile(schemaPath, "utf-8")
    const schema = JSON.parse(schemaContent)

    // Setup AJV validator
    const ajv = new Ajv({ allErrors: true, strict: true })
    addFormats(ajv)
    const validate = ajv.compile(schema)

    // Find all tool JSON files (excluding schema.json)
    const toolFiles = await glob("tools/*.json", {
      cwd: process.cwd(),
      ignore: ["tools/schema.json"],
    })

    if (toolFiles.length === 0) {
      errors.push("No tool files found in tools/ directory")
      return { success: false, toolCount: 0, errors }
    }

    if (verbose) console.log(`📁 Found ${toolFiles.length} tool file(s)`)

    // Parse and validate all tools
    const allTools: Tool[] = []
    const toolNames = new Set<string>()

    for (const filePath of toolFiles) {
      const fullPath = join(process.cwd(), filePath)
      let content: string
      let data: unknown

      try {
        content = await readFile(fullPath, "utf-8")
        data = JSON.parse(content)
      } catch (err) {
        errors.push(`${filePath}: JSON parse error - ${err instanceof Error ? err.message : String(err)}`)
        continue
      }

      // Strip $schema property if present (used for IDE validation)
      if (data && typeof data === "object" && "$schema" in data) {
        delete data.$schema
      }

      // Validate entire file against collection schema
      if (!validate(data)) {
        const validationErrors = validate.errors
          ?.map((e) => `${e.instancePath || "/"} ${e.message}`)
          .join(", ")
        errors.push(`${filePath}: Validation failed - ${validationErrors}`)
        continue
      }

      // Extract tools array from validated collection
      const collection = data as { tools: Tool[] }
      const tools = collection.tools

      for (let i = 0; i < tools.length; i++) {
        const tool = tools[i]
        const toolId = `${filePath}[${i}]`

        // Check for duplicate names (case-insensitive)
        const nameLower = tool.name.toLowerCase()
        if (toolNames.has(nameLower)) {
          errors.push(`${toolId}: Duplicate tool name "${tool.name}"`)
          continue
        }

        toolNames.add(nameLower)
        allTools.push(tool)
      }
    }

    // If we have any errors, fail early
    if (errors.length > 0) {
      return { success: false, toolCount: allTools.length, errors }
    }

    // Sort alphabetically by name
    allTools.sort((a, b) => a.name.localeCompare(b.name))

    // Generate TypeScript types from the tool item schema
    // Extract the tool item schema and simplify categories for TS generation
    const toolItemSchema = JSON.parse(JSON.stringify(schema.properties.tools.items))
    delete toolItemSchema.properties.categories.minItems
    delete toolItemSchema.properties.categories.maxItems

    const tsContent = await compile(toolItemSchema, "Tool", {
      bannerComment: "// biome-ignore lint: auto-generated file\n// This file is auto-generated. Do not edit manually.",
      style: {
        semi: false,
        singleQuote: false,
        tabWidth: 2,
        useTabs: false,
        trailingComma: "all",
      },
      // Prevent fetching external schemas
      unreachableDefinitions: true,
      $refOptions: {
        resolve: {
          http: false,
          https: false,
        },
      },
    })

    // Write TypeScript types
    const typesPath = join(process.cwd(), "src/types/tool.ts")
    await mkdir(dirname(typesPath), { recursive: true })
    await writeFile(typesPath, tsContent, "utf-8")

    // Write combined JSON
    const jsonPath = join(process.cwd(), "src/tools.json")
    await mkdir(dirname(jsonPath), { recursive: true })
    await writeFile(jsonPath, JSON.stringify(allTools, null, 2), "utf-8")

    // Copy schema to public folder for serving
    const publicSchemaPath = join(process.cwd(), "public/schemas/tool-collection.json")
    await mkdir(dirname(publicSchemaPath), { recursive: true })
    await writeFile(publicSchemaPath, schemaContent, "utf-8")

    if (verbose) console.log(`✅ Generated ${allTools.length} tools`)

    return { success: true, toolCount: allTools.length }
  } catch (err) {
    errors.push(`Fatal error: ${err instanceof Error ? err.message : String(err)}`)
    return { success: false, toolCount: 0, errors }
  }
}
