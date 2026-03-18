import { ExternalLink } from "lucide-react"

import { Dialog } from "./dialog"
import { useDialog } from "./hooks/useDialog"
import type { Tool } from "./types/tool"

interface ToolCardProps {
  tool: Tool
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { open, setOpen, close } = useDialog()

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
        <Dialog labelId={`tool-dialog-${tool.name}`} title={tool.name} onClose={close}>
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
        </Dialog>
      )}
    </>
  )
}
