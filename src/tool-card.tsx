import { ExternalLink, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import type { Tool } from "./types/tool"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close()
      }
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
        onClick={() => {
          setOpen(true)
        }}
        className="border-foreground bg-card hover:border-primary group flex w-full items-center gap-3 border-2 p-4 text-left transition-colors"
      >
        <span
          className="bg-primary inline-block h-2 w-2 shrink-0 transition-transform group-hover:scale-125"
          aria-hidden="true"
        />
        <h3 className="text-card-foreground truncate font-mono text-sm font-bold tracking-wider uppercase">
          {tool.name}
        </h3>
        <span className="text-muted-foreground ml-auto shrink-0 font-mono text-[10px] tracking-wider uppercase">
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
          <div className="bg-foreground/60 absolute inset-0" onClick={close} aria-hidden="true" />

          {/* Dialog */}
          <div className="border-foreground bg-card relative z-10 w-full max-w-md border-2">
            {/* Header */}
            <div className="border-foreground bg-primary flex items-center justify-between border-b-2 p-4">
              <h2
                id={`tool-dialog-${tool.name}`}
                className="text-primary-foreground font-mono text-sm font-bold tracking-wider uppercase"
              >
                {tool.name}
              </h2>
              <button
                type="button"
                onClick={close}
                className="text-primary-foreground hover:bg-primary-foreground/20 flex h-8 w-8 items-center justify-center transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 p-6">
              <p className="text-card-foreground font-sans text-sm leading-relaxed">
                {tool.description}
              </p>

              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                  Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tool.categories.map((cat: string) => (
                    <span
                      key={cat}
                      className="bg-secondary text-secondary-foreground border-border border px-2 py-0.5 font-mono text-xs tracking-wider uppercase"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-border mt-2 border-t-2 pt-4">
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-foreground bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 border-2 px-4 py-3 font-mono text-xs tracking-wider uppercase transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
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
