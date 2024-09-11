import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  publicDir: "public",
  plugins: [svelte(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/scripts/background.ts"),
        content: resolve(__dirname, "src/scripts/content.ts"),
        page: resolve(__dirname, "src/scripts/page.ts"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
