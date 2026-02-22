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
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Categories
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="font-mono text-xs uppercase tracking-wider text-primary hover:underline underline-offset-4"
          >
            Clear ({selected.length})
          </button>
        )}
      </div>
      <fieldset className="flex flex-wrap gap-2 m-0 p-0 border-0" aria-label="Filter by category">
        {visible.map(cat => {
          const isActive = selected.includes(cat)
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onToggle(cat)}
              className={`
                px-3 py-1.5 border-2 font-mono text-xs uppercase tracking-wider transition-colors
                ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary"
                }
              `}
              aria-pressed={isActive}
            >
              {cat}
            </button>
          )
        })}

        {hasOverflow && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 border-2 border-dashed border-muted-foreground font-mono text-xs uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5"
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                +{hiddenCount} more
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </fieldset>
    </div>
  )
}
