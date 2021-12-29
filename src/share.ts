import { createApp } from 'vue'

import i18n from '@/locales'

import NaiveUI from '@/components/naive-ui'
import GUI from '@/components/ui'
import '@/styles/index.scss'

import DatavCharts from '@/components'

import store from './store'
import router from './routes/share'
import App from './App.vue'

const app = createApp(App)
app.use(i18n)
app.use(NaiveUI)
app.use(GUI)
app.use(DatavCharts)
app.use(store)
app.use(router)

app.mount('#app')
