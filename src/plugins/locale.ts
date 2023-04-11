import type { App } from 'vue'

export default {
  install: (app: App) => {
    app.config.globalProperties.$locale = 'fa'
  }
}
