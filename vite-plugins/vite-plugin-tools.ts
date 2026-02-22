import type { Plugin, ResolvedConfig } from "vite"
import { generateTools } from "../scripts/lib/generate.js"

export function toolsPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: "vite-plugin-tools",

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async buildStart() {
      // Use verbose logging for 'info' level, quiet for others
      const verbose = config.logLevel === "info"

      const result = await generateTools({ verbose })

      if (!result.success) {
        const errorMsg = result.errors?.join("\n") || "Unknown error"
        this.error(`Tool generation failed:\n${errorMsg}`)
      }

      // Log using Vite's logger (respects logLevel)
      if (result.success && verbose) {
        config.logger.info(`[tools] Generated ${result.toolCount} tools`)
      }
    },

    configureServer(server) {
      server.watcher.add("tools/**/*.json")

      server.watcher.on("change", async path => {
        if (!path.includes("/tools/")) return

        const verbose = config.logLevel === "info"

        if (verbose) {
          config.logger.info("[tools] Regenerating...")
        }

        const result = await generateTools({ verbose })

        if (result.success) {
          if (verbose) {
            config.logger.info(`[tools] Generated ${result.toolCount} tools`)
          }
          // Trigger full reload
          server.ws.send({ type: "full-reload", path: "*" })
        } else {
          config.logger.error(
            `[tools] Generation failed: ${result.errors?.join(", ") || "Unknown error"}`,
          )
        }
      })
    },
  }
}
