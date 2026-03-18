import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

function isInitialThemeDark() {
  const stored = localStorage.getItem("theme")
  if (stored) {
    return stored === "dark"
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function ThemeToggle() {
  const [dark, setDark] = useState(isInitialThemeDark)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setDark(mediaQuery.matches)
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="border-foreground bg-card text-card-foreground hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center border-2 transition-colors"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
