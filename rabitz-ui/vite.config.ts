import { defineConfig } from 'vitest/config'
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    tailwindcss(),
    solid({ hot: false }),
    dts({
      rollupTypes: true
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index",
    },
    cssCodeSplit: false,
    target: "esnext",
    rollupOptions: {
      external: ["solid-js"]
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,
    setupFiles: ["src/tests/setup.ts"],
  },
})