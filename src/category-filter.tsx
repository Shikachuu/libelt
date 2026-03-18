import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const VISIBLE_COUNT = 8

interface CategoryFilterProps {
  categories: string[]
  selected: string[]
  onToggle: (category: string) => void
  onClear: () => void
}

export function CategoryFilter({ categories, selected, onToggle, onClear }: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false)

  const hasOverflow = categories.length > VISIBLE_COUNT
  const visible = expanded ? categories : categories.slice(0, VISIBLE_COUNT)
  const hiddenCount = categories.length - VISIBLE_COUNT

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          Categories
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-primary font-mono text-xs tracking-wider uppercase underline-offset-4 hover:underline"
          >
            Clear ({selected.length})
          </button>
        )}
      </div>
      <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0" aria-label="Filter by category">
        {visible.map(cat => {
          const isActive = selected.includes(cat)
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                onToggle(cat)
              }}
              className={`border-2 px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary"
              } `}
              aria-pressed={isActive}
            >
              {cat}
            </button>
          )
        })}

        {hasOverflow && (
          <button
            type="button"
            onClick={() => {
              setExpanded(!expanded)
            }}
            className="border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary flex items-center gap-1.5 border-2 border-dashed px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors"
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                +{hiddenCount} more
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </fieldset>
    </div>
  )
}
