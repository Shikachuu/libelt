import { Search } from "lucide-react"

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="border-2 border-foreground bg-card flex items-center">
      <div className="flex items-center justify-center w-12 h-12 border-r-2 border-foreground bg-primary">
        <Search className="w-5 h-5 text-primary-foreground" />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="SEARCH TOOLS..."
        className="flex-1 h-12 px-4 bg-card text-card-foreground font-mono text-sm uppercase tracking-wider placeholder:text-muted-foreground focus:outline-none"
        aria-label="Search tools by name"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="w-12 h-12 flex items-center justify-center border-l-2 border-foreground text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors font-mono text-xs"
          aria-label="Clear search"
        >
          CLR
        </button>
      )}
    </div>
  )
}
