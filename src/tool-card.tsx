import { ExternalLink, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import type { Tool } from "./types/tool"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, close])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left border-2 border-foreground bg-card p-4 flex items-center gap-3 hover:border-primary transition-colors group"
      >
        <span
          className="inline-block w-2 h-2 bg-primary shrink-0 group-hover:scale-125 transition-transform"
          aria-hidden="true"
        />
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider truncate text-card-foreground">
          {tool.name}
        </h3>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">
          {tool.categories[0]}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`tool-dialog-${tool.name}`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/60" onClick={close} aria-hidden="true" />

          {/* Dialog */}
          <div className="relative border-2 border-foreground bg-card w-full max-w-md z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-foreground bg-primary">
              <h2
                id={`tool-dialog-${tool.name}`}
                className="font-mono text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                {tool.name}
              </h2>
              <button
                type="button"
                onClick={close}
                className="w-8 h-8 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4">
              <p className="font-sans text-sm leading-relaxed text-card-foreground">
                {tool.description}
              </p>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tool.categories.map((cat: string) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-wider border border-border"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-border pt-4 mt-2">
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-foreground bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
