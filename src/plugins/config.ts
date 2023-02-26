import type { App } from 'vue'
import config from '../config/index'

export default {
  install: (app: App) => {
    app.config.globalProperties.$config = config
  }
}
