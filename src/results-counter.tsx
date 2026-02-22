interface ResultsCounterProps {
  filtered: number
  total: number
}

export function ResultsCounter({ filtered, total }: ResultsCounterProps) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
      <span className="inline-block w-1.5 h-1.5 bg-primary" aria-hidden="true" />
      <span>
        {filtered === total ? `${total} tools indexed` : `${filtered} of ${total} results`}
      </span>
    </div>
  )
}
