import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { toolsPlugin } from "./vite-plugins/vite-plugin-tools"

// oxlint-disable-next-line import/no-default-export -- required by Vite
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
