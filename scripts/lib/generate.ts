import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

import Ajv from "ajv"
import addFormats from "ajv-formats"
import glob from "fast-glob"
import { compile } from "json-schema-to-typescript"

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

// oxlint-disable max-statements -- it would be unnecessary to split this bc it would separate the logic
export const generateTools = async (options: GenerateOptions = {}): Promise<GenerateResult> => {
  const { verbose = false } = options
  const errors: string[] = []

  try {
    if (verbose) {
      console.log("🔧 Generating tools...")
    }

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
      return { errors, success: false, toolCount: 0 }
    }

    if (verbose) {
      console.log(`📁 Found ${toolFiles.length} tool file(s)`)
    }

    // Read all tool files in parallel
    const fileContents = await Promise.all(
      toolFiles.map(
        async (filePath): Promise<{ data: unknown; filePath: string } | { error: string }> => {
          const fullPath = join(process.cwd(), filePath)
          try {
            const content = await readFile(fullPath, "utf-8")
            return { data: JSON.parse(content) as unknown, filePath }
          } catch (err) {
            return {
              error: `${filePath}: JSON parse error - ${err instanceof Error ? err.message : String(err)}`,
            }
          }
        },
      ),
    )

    // Parse and validate all tools
    const allTools: Tool[] = []
    const toolNames = new Set<string>()

    for (const result of fileContents) {
      if ("error" in result) {
        errors.push(result.error)
        continue
      }

      const { data, filePath } = result

      // Strip $schema property if present (used for IDE validation)
      if (data && typeof data === "object" && "$schema" in data) {
        delete (data as Record<string, unknown>).$schema
      }

      // Validate entire file against collection schema
      if (!validate(data)) {
        const validationErrors = validate.errors
          ?.map(e => `${e.instancePath || "/"} ${e.message}`)
          .join(", ")
        errors.push(`${filePath}: Validation failed - ${validationErrors}`)
        continue
      }

      // Extract tools array from validated collection
      const collection = data as { tools: Tool[] }
      const { tools } = collection

      for (let i = 0; i < tools.length; i += 1) {
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
      return { errors, success: false, toolCount: allTools.length }
    }

    allTools.sort((a, b) => a.name.localeCompare(b.name))

    const toolItemSchema = JSON.parse(JSON.stringify(schema.properties.tools.items))
    delete toolItemSchema.properties.categories.minItems
    delete toolItemSchema.properties.categories.maxItems

    const tsContent = await compile(toolItemSchema, "Tool", {
      $refOptions: {
        resolve: {
          http: false,
          https: false,
        },
      },
      bannerComment: "/* oxlint-disable */\n// This file is auto-generated. Do not edit manually.",
      style: {
        semi: false,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: "all",
        useTabs: false,
      },
      unreachableDefinitions: true,
    })

    const typesPath = join(process.cwd(), "src/types/tool.ts")
    await mkdir(dirname(typesPath), { recursive: true })
    await writeFile(typesPath, tsContent, "utf-8")

    // Write combined JSON
    const jsonPath = join(process.cwd(), "src/tools.json")
    await mkdir(dirname(jsonPath), { recursive: true })
    await writeFile(jsonPath, JSON.stringify(allTools, null, 2), "utf-8")

    const publicSchemaPath = join(process.cwd(), "public/schemas/tool-collection.json")
    await mkdir(dirname(publicSchemaPath), { recursive: true })
    await writeFile(publicSchemaPath, schemaContent, "utf-8")

    if (verbose) {
      console.log(`✅ Generated ${allTools.length} tools`)
    }

    return { success: true, toolCount: allTools.length }
  } catch (err) {
    errors.push(`Fatal error: ${err instanceof Error ? err.message : String(err)}`)
    return { errors, success: false, toolCount: 0 }
  }
}
