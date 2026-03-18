import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
  <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
    <button
      type="button"
      onClick={() => {
        onPageChange(Math.max(1, currentPage - 1))
      }}
      disabled={currentPage <= 1}
      className="border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center border-2 transition-colors disabled:pointer-events-none disabled:opacity-30"
      aria-label="Previous page"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
      <button
        key={p}
        type="button"
        onClick={() => {
          onPageChange(p)
        }}
        className={`h-10 w-10 border-2 font-mono text-xs font-bold transition-colors ${
          p === currentPage
            ? "border-primary bg-primary text-primary-foreground"
            : "border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary"
        }`}
        aria-current={p === currentPage ? "page" : undefined}
      >
        {p}
      </button>
    ))}

    <button
      type="button"
      onClick={() => {
        onPageChange(Math.min(totalPages, currentPage + 1))
      }}
      disabled={currentPage >= totalPages}
      className="border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center border-2 transition-colors disabled:pointer-events-none disabled:opacity-30"
      aria-label="Next page"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </nav>
)
