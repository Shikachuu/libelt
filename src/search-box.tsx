import { Search } from "lucide-react"

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="border-foreground bg-card flex items-center border-2">
      <div className="border-foreground bg-primary flex h-12 w-12 items-center justify-center border-r-2">
        <Search className="text-primary-foreground h-5 w-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => {
          onChange(e.target.value)
        }}
        placeholder="SEARCH TOOLS..."
        className="bg-card text-card-foreground placeholder:text-muted-foreground h-12 flex-1 px-4 font-mono text-sm tracking-wider uppercase focus:outline-none"
        aria-label="Search tools by name"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("")
          }}
          className="border-foreground text-muted-foreground hover:bg-secondary hover:text-foreground flex h-12 w-12 items-center justify-center border-l-2 font-mono text-xs transition-colors"
          aria-label="Clear search"
        >
          CLR
        </button>
      )}
    </div>
  )
}
