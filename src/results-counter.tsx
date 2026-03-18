interface ResultsCounterProps {
  filtered: number
  total: number
}

export function ResultsCounter({ filtered, total }: ResultsCounterProps) {
  return (
    <div className="text-muted-foreground flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
      <span className="bg-primary inline-block h-1.5 w-1.5" aria-hidden="true" />
      <span>
        {filtered === total ? `${total} tools indexed` : `${filtered} of ${total} results`}
      </span>
    </div>
  )
}
