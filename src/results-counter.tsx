interface ResultsCounterProps {
  filtered: number
  total: number
}

export const ResultsCounter = ({ filtered, total }: ResultsCounterProps) => (
  <div className="text-muted-foreground flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
    <span className="bg-primary inline-block h-1.5 w-1.5" aria-hidden="true" />
    <span>{filtered === total ? `${total} tools indexed` : `${filtered} of ${total} results`}</span>
  </div>
)
