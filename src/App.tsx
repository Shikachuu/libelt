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
  keys: [
    { name: "name", weight: 0.5 }, // 50% - highest priority
    { name: "description", weight: 0.3 }, // 30% - medium priority
    { name: "categories", weight: 0.2 }, // 20% - lowest priority
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  findAllMatches: true,
  minMatchCharLength: 1,
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

    // Debug logging
    if (results.length > 0) {
      console.log(
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
  const filtered = useMemo(() => {
    return searchFiltered.filter(tool => {
      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some(cat => tool.categories.includes(cat))

      return matchesCategories
    })
  }, [searchFiltered, selectedCategories])

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
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b-2 border-foreground">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary" aria-hidden="true" />
              <h1 className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-widest text-foreground">
                Libelt
              </h1>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground ml-6">
              Find developer tools, libraries & frameworks
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SubmitToolButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
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
          <div className="h-0.5 bg-foreground flex-1" aria-hidden="true" />
          <ResultsCounter filtered={filtered.length} total={tools.length} />
          <div className="h-0.5 bg-foreground flex-1" aria-hidden="true" />
        </div>

        {/* Results */}
        <section aria-label="Search results">
          {filtered.length === 0 ? (
            <div className="border-2 border-dashed border-muted-foreground p-12 flex flex-col items-center gap-3">
              <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                No tools found
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Try adjusting your search or filters
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="w-10 h-10 border-2 border-foreground bg-card flex items-center justify-center text-card-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-10 h-10 border-2 font-mono text-xs font-bold transition-colors ${
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
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="w-10 h-10 border-2 border-foreground bg-card flex items-center justify-center text-card-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}

        {/* Footer */}
        <footer className="border-t-2 border-foreground pt-6 pb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {tools.length} Tools Indexed
          </span>
        </footer>
      </div>
    </main>
  )
}
