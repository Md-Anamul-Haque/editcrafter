import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/edit-crafter/EditCrafter.tsx'),
      name: 'EditCrafter',
      // formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [react(), dts(
    {
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, "tsconfig.app.json"),
      // rollupTypes: true,
      outDir: 'dist',

    }
  )],
})
