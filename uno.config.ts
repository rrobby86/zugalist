import { defineConfig, presetWind4, transformerDirectives } from "unocss"
import presetIcons from "@unocss/preset-icons"
import presetWebFonts from "@unocss/preset-web-fonts"

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        default: [
          { name: "Nunito", weights: ["400", "700"] },
          { name: "sans-serif", provider: "none" },
        ],
      },
    }),
  ],
  transformers: [transformerDirectives()],
})
