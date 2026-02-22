import { GitPullRequest, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function SubmitToolButton() {
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
        className="px-4 py-2 border-2 border-foreground bg-card text-card-foreground font-mono text-xs uppercase tracking-wider hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
      >
        <GitPullRequest className="w-3.5 h-3.5" />
        Submit Tool
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/60"
            onClick={() => close()}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="relative border-2 border-foreground bg-card w-full max-w-md z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-foreground bg-primary">
              <h2
                id="submit-dialog-title"
                className="font-mono text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                Submit a Tool
              </h2>
              <button
                type="button"
                onClick={() => close()}
                className="w-8 h-8 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center shrink-0 bg-secondary">
                  <span className="font-mono text-sm font-bold text-secondary-foreground">1</span>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider font-bold text-card-foreground">
                    Fork the Repository
                  </p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    Fork our GitHub repository to your account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center shrink-0 bg-secondary">
                  <span className="font-mono text-sm font-bold text-secondary-foreground">2</span>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider font-bold text-card-foreground">
                    Add Your Tool
                  </p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    {"Add an entry to"} <code className="font-mono text-primary">tools.json</code>{" "}
                    {"with name, description, categories, and GitHub URL."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center shrink-0 bg-secondary">
                  <span className="font-mono text-sm font-bold text-secondary-foreground">3</span>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider font-bold text-card-foreground">
                    Open a Pull Request
                  </p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    {"Submit a PR and we'll review your addition."}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-border pt-4 mt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-foreground bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  <GitPullRequest className="w-4 h-4" />
                  Open GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
