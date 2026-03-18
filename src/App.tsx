import Fuse from "fuse.js"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"

import { CategoryFilter } from "./category-filter"
import { ResultsCounter } from "./results-counter"
import { SearchBox } from "./search-box"
import { SubmitToolButton } from "./submit-tool-button"
import { ThemeToggle } from "./theme-toggle"
import { ToolCard } from "./tool-card"
import toolsData from "./tools.json"
import type { Tool } from "./types/tool"

const tools: Tool[] = toolsData
const PER_PAGE = 12

const fuseOptions = {
  findAllMatches: true,
  ignoreLocation: true,
  includeScore: true,
  keys: [
    { name: "name", weight: 0.5 }, // 50% - highest priority
    { name: "description", weight: 0.3 }, // 30% - medium priority
    { name: "categories", weight: 0.2 }, // 20% - lowest priority
  ],
  minMatchCharLength: 1,
  threshold: 0.4,
}

const allCategories = Array.from(new Set(tools.flatMap(t => t.categories))).sort()

export default function App() {
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [page, setPage] = useState(1)

  // Initialize Fuse instance (memoized - only created once)
  const fuse = useMemo(() => new Fuse(tools, fuseOptions), [])

  // Stage 1: Fuzzy search
  const searchFiltered = useMemo(() => {
    if (!search) {
      return tools
    }

    const results = fuse.search(search)

    if (results.length > 0) {
      console.debug(
        "Fuse.js search results:",
        results.map(r => ({
          name: r.item.name,
          score: r.score?.toFixed(3),
        })),
      )
    }

    return results.map(r => r.item)
  }, [search, fuse])

  // Stage 2: Category filter
  const filtered = useMemo(
    () =>
      searchFiltered.filter(tool => {
        const matchesCategories =
          selectedCategories.length === 0 ||
          selectedCategories.some(cat => tool.categories.includes(cat))

        return matchesCategories
      }),
    [searchFiltered, selectedCategories],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    )
    setPage(1)
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  return (
    <main className="bg-background min-h-screen">
      {/* HEADER */}
      <header className="border-foreground border-b-2">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-4 py-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-3 w-3" aria-hidden="true" />
              <h1 className="text-foreground font-mono text-xl font-bold tracking-widest uppercase sm:text-2xl">
                Libelt
              </h1>
            </div>
            <p className="text-muted-foreground ml-6 font-mono text-xs tracking-widest uppercase">
              Find developer tools, libraries & frameworks
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SubmitToolButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
        {/* Search */}
        <section aria-label="Search">
          <SearchBox value={search} onChange={handleSearch} />
        </section>

        {/* Categories */}
        <section aria-label="Category filters">
          <CategoryFilter
            categories={allCategories}
            selected={selectedCategories}
            onToggle={toggleCategory}
            onClear={() => {
              setSelectedCategories([])
              setPage(1)
            }}
          />
        </section>

        {/* Divider with counter */}
        <div className="flex items-center gap-4">
          <div className="bg-foreground h-0.5 flex-1" aria-hidden="true" />
          <ResultsCounter filtered={filtered.length} total={tools.length} />
          <div className="bg-foreground h-0.5 flex-1" aria-hidden="true" />
        </div>

        {/* Results */}
        <section aria-label="Search results">
          {filtered.length === 0 ? (
            <div className="border-muted-foreground flex flex-col items-center gap-3 border-2 border-dashed p-12">
              <span className="text-muted-foreground font-mono text-sm tracking-wider uppercase">
                No tools found
              </span>
              <span className="text-muted-foreground font-mono text-xs">
                Try adjusting your search or filters
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {paged.map(tool => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
            <button
              type="button"
              onClick={() => {
                setPage(p => Math.max(1, p - 1))
              }}
              disabled={safePage <= 1}
              className="border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center border-2 transition-colors disabled:pointer-events-none disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPage(p)
                }}
                className={`h-10 w-10 border-2 font-mono text-xs font-bold transition-colors ${
                  p === safePage
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary"
                }`}
                aria-current={p === safePage ? "page" : undefined}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setPage(p => Math.min(totalPages, p + 1))
              }}
              disabled={safePage >= totalPages}
              className="border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center border-2 transition-colors disabled:pointer-events-none disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}

        {/* Footer */}
        <footer className="border-foreground border-t-2 pt-6 pb-8">
          <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            {tools.length} Tools Indexed
          </span>
        </footer>
      </div>
    </main>
  )
}
