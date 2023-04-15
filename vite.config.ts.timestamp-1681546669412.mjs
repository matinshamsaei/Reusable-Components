// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "file:///C:/Users/MTYN/Desktop/web/Project/routaa-shared-components/node_modules/vite/dist/node/index.js";
import { visualizer } from "file:///C:/Users/MTYN/Desktop/web/Project/routaa-shared-components/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import vue from "file:///C:/Users/MTYN/Desktop/web/Project/routaa-shared-components/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///C:/Users/MTYN/Desktop/web/Project/routaa-shared-components/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\MTYN\\Desktop\\web\\Project\\routaa-shared-components";
var __vite_injected_original_import_meta_url = "file:///C:/Users/MTYN/Desktop/web/Project/routaa-shared-components/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    visualizer(),
    dts({
      insertTypesEntry: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    },
    extensions: [".js", ".ts", ".json", ".vue"]
  },
  build: {
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/RoutaaSharedComponents.ts"),
      name: "routaa-shared-kit",
      fileName: (format) => `routaa-shared-components.${format}.js`
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-router",
        "@vueuse/core",
        "@routaa/ui-kit",
        "vue-i18n",
        "vuedraggable",
        "vue3-persian-datetime-picker",
        "moment-jalaali",
        "vue3-colorpicker",
        "downloadjs",
        "@vuelidate",
        "@tinymce",
        "tinymce",
        "bootstrap",
        "/tinymce"
      ],
      output: {
        exports: "named",
        assetFileNames: `routaa-shared-components.[ext]`,
        globals: {
          vue: "Vue",
          bootstrap: "Bootstrap",
          "vue-i18n": "vue-i18n",
          "vue-router": "vue-router",
          "tinymce/tinymce": "tinymce/tinymce",
          downloadjs: "downloadjs",
          "@vuelidate/core": "@vuelidate/core",
          "@vuelidate/validators": "@vuelidate/validators",
          vuedraggable: "vuedraggable",
          "@tinymce/tinymce-vue": "@tinymce/tinymce-vue",
          "moment-jalaali": "moment-jalaali",
          "@routaa/ui-kit": "@routaa/ui-kit",
          "vue3-colorpicker": "vue3-colorpicker",
          "vue3-persian-datetime-picker": "vue3-persian-datetime-picker"
        }
      },
      treeshake: {
        preset: "smallest"
      }
    }
  },
  css: { preprocessorOptions: { scss: { charset: false } } },
  server: {
    host: true,
    port: 5050
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNVFlOXFxcXERlc2t0b3BcXFxcd2ViXFxcXFByb2plY3RcXFxccm91dGFhLXNoYXJlZC1jb21wb25lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNVFlOXFxcXERlc2t0b3BcXFxcd2ViXFxcXFByb2plY3RcXFxccm91dGFhLXNoYXJlZC1jb21wb25lbnRzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9NVFlOL0Rlc2t0b3Avd2ViL1Byb2plY3Qvcm91dGFhLXNoYXJlZC1jb21wb25lbnRzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKHtcclxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLm1kJC9dXHJcbiAgICB9KSxcclxuICAgIHZpc3VhbGl6ZXIoKSBhcyB1bmtub3duIGFzIFBsdWdpbk9wdGlvbixcclxuICAgIGR0cyh7XHJcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWVcclxuICAgIH0pXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfSxcclxuICAgIGV4dGVuc2lvbnM6IFsnLmpzJywgJy50cycsICcuanNvbicsICcudnVlJ11cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBlbXB0eU91dERpcjogZmFsc2UsXHJcbiAgICBtaW5pZnk6IHRydWUsXHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL1JvdXRhYVNoYXJlZENvbXBvbmVudHMudHMnKSxcclxuICAgICAgbmFtZTogJ3JvdXRhYS1zaGFyZWQta2l0JyxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGByb3V0YWEtc2hhcmVkLWNvbXBvbmVudHMuJHtmb3JtYXR9LmpzYFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFtcclxuICAgICAgICAndnVlJyxcclxuICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgJ0Byb3V0YWEvdWkta2l0JyxcclxuICAgICAgICAndnVlLWkxOG4nLFxyXG4gICAgICAgICd2dWVkcmFnZ2FibGUnLFxyXG4gICAgICAgICd2dWUzLXBlcnNpYW4tZGF0ZXRpbWUtcGlja2VyJyxcclxuICAgICAgICAnbW9tZW50LWphbGFhbGknLFxyXG4gICAgICAgICd2dWUzLWNvbG9ycGlja2VyJyxcclxuICAgICAgICAnZG93bmxvYWRqcycsXHJcbiAgICAgICAgJ0B2dWVsaWRhdGUnLFxyXG4gICAgICAgICdAdGlueW1jZScsXHJcbiAgICAgICAgJ3RpbnltY2UnLFxyXG4gICAgICAgICdib290c3RyYXAnLFxyXG4gICAgICAgICcvdGlueW1jZSdcclxuICAgICAgXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZXhwb3J0czogJ25hbWVkJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogYHJvdXRhYS1zaGFyZWQtY29tcG9uZW50cy5bZXh0XWAsXHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgdnVlOiAnVnVlJyxcclxuICAgICAgICAgIGJvb3RzdHJhcDogJ0Jvb3RzdHJhcCcsXHJcbiAgICAgICAgICAndnVlLWkxOG4nOiAndnVlLWkxOG4nLFxyXG4gICAgICAgICAgJ3Z1ZS1yb3V0ZXInOiAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAndGlueW1jZS90aW55bWNlJzogJ3RpbnltY2UvdGlueW1jZScsXHJcbiAgICAgICAgICBkb3dubG9hZGpzOiAnZG93bmxvYWRqcycsXHJcbiAgICAgICAgICAnQHZ1ZWxpZGF0ZS9jb3JlJzogJ0B2dWVsaWRhdGUvY29yZScsXHJcbiAgICAgICAgICAnQHZ1ZWxpZGF0ZS92YWxpZGF0b3JzJzogJ0B2dWVsaWRhdGUvdmFsaWRhdG9ycycsXHJcbiAgICAgICAgICB2dWVkcmFnZ2FibGU6ICd2dWVkcmFnZ2FibGUnLFxyXG4gICAgICAgICAgJ0B0aW55bWNlL3RpbnltY2UtdnVlJzogJ0B0aW55bWNlL3RpbnltY2UtdnVlJyxcclxuICAgICAgICAgICdtb21lbnQtamFsYWFsaSc6ICdtb21lbnQtamFsYWFsaScsXHJcbiAgICAgICAgICAnQHJvdXRhYS91aS1raXQnOiAnQHJvdXRhYS91aS1raXQnLFxyXG4gICAgICAgICAgJ3Z1ZTMtY29sb3JwaWNrZXInOiAndnVlMy1jb2xvcnBpY2tlcicsXHJcbiAgICAgICAgICAndnVlMy1wZXJzaWFuLWRhdGV0aW1lLXBpY2tlcic6ICd2dWUzLXBlcnNpYW4tZGF0ZXRpbWUtcGlja2VyJyxcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHRyZWVzaGFrZToge1xyXG4gICAgICAgIHByZXNldDogJ3NtYWxsZXN0J1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBjc3M6IHsgcHJlcHJvY2Vzc29yT3B0aW9uczogeyBzY3NzOiB7IGNoYXJzZXQ6IGZhbHNlIH0gfSB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIHBvcnQ6IDUwNTBcclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFcsU0FBUyxlQUFlLFdBQVc7QUFDalosU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBRTdCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFOaEIsSUFBTSxtQ0FBbUM7QUFBZ00sSUFBTSwyQ0FBMkM7QUFRMVIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsU0FBUyxDQUFDLFVBQVUsT0FBTztBQUFBLElBQzdCLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsSUFDQSxZQUFZLENBQUMsT0FBTyxPQUFPLFNBQVMsTUFBTTtBQUFBLEVBQzVDO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsSUFDUixLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsTUFDekQsTUFBTTtBQUFBLE1BQ04sVUFBVSxDQUFDLFdBQVcsNEJBQTRCO0FBQUEsSUFDcEQ7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxnQkFBZ0I7QUFBQSxRQUNoQixTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsVUFDTCxXQUFXO0FBQUEsVUFDWCxZQUFZO0FBQUEsVUFDWixjQUFjO0FBQUEsVUFDZCxtQkFBbUI7QUFBQSxVQUNuQixZQUFZO0FBQUEsVUFDWixtQkFBbUI7QUFBQSxVQUNuQix5QkFBeUI7QUFBQSxVQUN6QixjQUFjO0FBQUEsVUFDZCx3QkFBd0I7QUFBQSxVQUN4QixrQkFBa0I7QUFBQSxVQUNsQixrQkFBa0I7QUFBQSxVQUNsQixvQkFBb0I7QUFBQSxVQUNwQixnQ0FBZ0M7QUFBQSxRQUNsQztBQUFBLE1BQ0Y7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsU0FBUyxNQUFNLEVBQUUsRUFBRTtBQUFBLEVBQ3pELFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
