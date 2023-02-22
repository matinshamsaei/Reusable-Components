import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'

import './assets/scss/style.scss'
import config from './plugins/config'
import FontAwesomeIcon from './plugins/font-awesome'
import messages from './translations'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: []
})

const i18n = createI18n({
  locale: 'fa',
  legacy: false,
  fallbackLocale: 'en',
  messages
})

app.use(i18n)
app.use(config)
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
