import { X } from "lucide-react"
import type { ReactNode } from "react"

interface DialogProps {
  labelId: string
  title: string
  onClose: () => void
  children: ReactNode
}

export const Dialog = ({ labelId, title, onClose, children }: DialogProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby={labelId}
  >
    {/* Backdrop */}
    <div className="bg-foreground/60 absolute inset-0" onClick={onClose} aria-hidden="true" />

    {/* Dialog */}
    <div className="border-foreground bg-card relative z-10 w-full max-w-md border-2">
      {/* Header */}
      <div className="border-foreground bg-primary flex items-center justify-between border-b-2 p-4">
        <h2
          id={labelId}
          className="text-primary-foreground font-mono text-sm font-bold tracking-wider uppercase"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20 flex h-8 w-8 items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-6">{children}</div>
    </div>
  </div>
)
