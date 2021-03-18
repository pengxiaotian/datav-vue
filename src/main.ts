import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import '@/styles/index.scss'

import GUI from '@/components/ui'

import App from './App.vue'
// import store from './store'
import router from './router'

const app = createApp(App)
// app.use(store)
app.use(router)
app.use(ElementPlus, { size: 'medium', zIndex: 3000 })
app.use(GUI)
app.mount('#app')
