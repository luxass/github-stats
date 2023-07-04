import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

export default defineConfig({
  presets: [
    presetUno({
      dark: "media"
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
});
