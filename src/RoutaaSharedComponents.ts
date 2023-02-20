import type { App, Plugin } from 'vue'

import './assets/scss/style.scss'

import * as Components from './components'
import * as Translations from './translations'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    NoItem: typeof Components.NoItem
  }

  export interface GlobalTranslation {
    Translations: typeof Translations
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

interface Options {
  config: object
}

export const createSharedComponents = (options: Options) => {
  const install = (app: App) => {
    app.config.globalProperties.$config = options.config
  }

  return {
    install
  }
}

export * from './components'
export * as Components from './components'
export * as Translations from './translations'

export { plugin as RoutaaUiKit }
export default plugin
