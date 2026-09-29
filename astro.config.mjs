import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://festivaldeitarocchi.it",
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
});
