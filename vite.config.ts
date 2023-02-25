import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    visualizer() as unknown as PluginOption,
    dts({
      insertTypesEntry: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.ts', '.json', '.vue']
  },
  build: {
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/RoutaaSharedComponents.ts'),
      name: 'routaa-ui-kit',
      fileName: (format) => `routaa-shared-components.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@vueuse/core', '@routaa/ui-kit', 'vue-i18n'],
      output: {
        exports: 'named',
        assetFileNames: `routaa-shared-components.[ext]`,
        globals: {
          vue: 'Vue',
          bootstrap: 'Bootstrap',
          'vue-i18n': 'vue-i18n',
          'vue-router': 'vue-router',
          '@vueuse/core': 'vueuse'
        }
      },
      treeshake: {
        preset: 'smallest'
      }
    }
  },
  css: { preprocessorOptions: { scss: { charset: false } } },
  server: {
    host: true,
    port: 5050
  }
})
