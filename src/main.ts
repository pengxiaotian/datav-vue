import { createApp } from 'vue'

import i18n from '@/locales'

import ElementPlus from '@/components/element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import GUI from '@/components/ui'
import '@/styles/index.scss'

import DatavCharts from '@/components'

import store from './store'
import router from './routes'
import App from './App.vue'

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus, { locale, size: 'medium', zIndex: 3000 })
app.use(GUI)
app.use(DatavCharts)
app.use(store)
app.use(router)

app.mount('#app')
