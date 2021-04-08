import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/styles/index.scss'

import GUI from '@/components/ui'

import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus, { locale, size: 'medium', zIndex: 3000 })
app.use(GUI)
app.mount('#app')
