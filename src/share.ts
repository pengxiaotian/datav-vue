import { createApp } from 'vue'
import { createPinia } from 'pinia'

import i18n from '@/locales'

import NaiveUI from '@/components/naive-ui'
import GUI from '@/components/ui'
import '@/styles/index.scss'

import DatavCharts from '@/components'

import router from './routes/share'
import AppRoot from './AppRoot.vue'

const app = createApp(AppRoot)
app.use(i18n)
app.use(NaiveUI)
app.use(GUI)
app.use(DatavCharts)
app.use(createPinia())
app.use(router)

app.mount('#app')
