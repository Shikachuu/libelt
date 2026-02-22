import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { toolsPlugin } from "./vite-plugins/vite-plugin-tools"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    toolsPlugin(),
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
})
