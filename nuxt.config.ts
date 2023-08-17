// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@unocss/nuxt", "@unocss/nuxt"],
  devtools: {
    enabled: true
  },
  plugins: [{ src: "~/plugins/vercel-analytics.ts", mode: "client" }],
  css: [
    "@unocss/reset/tailwind.css",
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
});
