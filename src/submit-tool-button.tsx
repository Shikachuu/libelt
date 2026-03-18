import { GitPullRequest, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function SubmitToolButton() {
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
        className="border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary flex items-center gap-2 border-2 px-4 py-2 font-mono text-xs tracking-wider uppercase transition-colors"
      >
        <GitPullRequest className="h-3.5 w-3.5" />
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
            className="bg-foreground/60 absolute inset-0"
            onClick={() => {
              close()
            }}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="border-foreground bg-card relative z-10 w-full max-w-md border-2">
            {/* Header */}
            <div className="border-foreground bg-primary flex items-center justify-between border-b-2 p-4">
              <h2
                id="submit-dialog-title"
                className="text-primary-foreground font-mono text-sm font-bold tracking-wider uppercase"
              >
                Submit a Tool
              </h2>
              <button
                type="button"
                onClick={() => {
                  close()
                }}
                className="text-primary-foreground hover:bg-primary-foreground/20 flex h-8 w-8 items-center justify-center transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-start gap-3">
                <div className="border-foreground bg-secondary flex h-8 w-8 shrink-0 items-center justify-center border-2">
                  <span className="text-secondary-foreground font-mono text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-card-foreground font-mono text-xs font-bold tracking-wider uppercase">
                    Fork the Repository
                  </p>
                  <p className="text-muted-foreground mt-1 font-sans text-sm">
                    Fork our GitHub repository to your account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="border-foreground bg-secondary flex h-8 w-8 shrink-0 items-center justify-center border-2">
                  <span className="text-secondary-foreground font-mono text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-card-foreground font-mono text-xs font-bold tracking-wider uppercase">
                    Add Your Tool
                  </p>
                  <p className="text-muted-foreground mt-1 font-sans text-sm">
                    Add an entry to a category file in{" "}
                    <code className="text-primary font-mono">tools/</code> with name, description,
                    categories, and GitHub URL.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="border-foreground bg-secondary flex h-8 w-8 shrink-0 items-center justify-center border-2">
                  <span className="text-secondary-foreground font-mono text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-card-foreground font-mono text-xs font-bold tracking-wider uppercase">
                    Open a Pull Request
                  </p>
                  <p className="text-muted-foreground mt-1 font-sans text-sm">
                    Submit a PR and we'll review your addition.
                  </p>
                </div>
              </div>

              <div className="border-border mt-2 border-t-2 pt-4">
                <a
                  href="https://github.com/Shikachuu/libelt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-foreground bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 border-2 px-4 py-3 font-mono text-xs tracking-wider uppercase transition-colors"
                >
                  <GitPullRequest className="h-4 w-4" />
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
