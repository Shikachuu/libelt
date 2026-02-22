import { generateTools } from "./lib/generate.js"

async function main() {
  const result = await generateTools({ verbose: true })

  if (!result.success) {
    console.error("\n❌ Generation failed")
    if (result.errors) {
      for (const error of result.errors) {
        console.error(`  - ${error}`)
      }
    }
    process.exit(1)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Fatal error:", err)
  process.exit(1)
})
