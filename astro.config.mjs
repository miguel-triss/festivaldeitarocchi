import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://festivaldeitarocchi.it",
  build: { inlineStylesheets: "always" }, // no render-blocking CSS request
  devToolbar: { enabled: false },
});
