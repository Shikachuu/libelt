import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

// oxlint-disable-next-line import/no-unassigned-import -- CSS side-effect import
import "./index.css"
import { App } from "./App.tsx"

const rootElement = document.getElementById("root")
if (!rootElement) {
  throw new Error("Root element not found")
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
