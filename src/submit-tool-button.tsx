import { GitPullRequest } from "lucide-react"

import { Dialog } from "./dialog"
import { useDialog } from "./hooks/useDialog"

export const SubmitToolButton = () => {
  const { open, setOpen, close } = useDialog()

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
        <Dialog labelId="submit-dialog-title" title="Submit a Tool" onClose={close}>
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
                Submit a PR and we&lsquo;ll review your addition.
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
        </Dialog>
      )}
    </>
  )
}
