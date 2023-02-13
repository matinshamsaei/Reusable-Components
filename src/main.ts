import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'

import './assets/scss/style.scss'
import messages from './translations'
import { setLocaleFromStorageOrCookie } from './lib/utils'

const app = createApp(App)

const i18n = createI18n({
  locale: setLocaleFromStorageOrCookie(),
  legacy: false,
  fallbackLocale: 'en',
  messages
})

app.use(i18n)

app.mount('#app')
