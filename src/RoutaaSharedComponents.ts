import type { App, Plugin } from 'vue'

import './assets/scss/style.scss'

import * as Components from './components'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    NoItem: typeof Components.NoItem
  }
}

// Main app plugin
const plugin: Plugin = {
  install(app: App) {
    Object.entries(Components).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}

export * from './components'
export * as Components from './components'
export * Translations from './translations'

export { plugin as RoutaaUiKit }
export default plugin
