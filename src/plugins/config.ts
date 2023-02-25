import config from '../config/index.ts'

export default {
  install: (app) => {
    app.config.globalProperties.$config = config
  }
}
