import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

export const navRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '*',
    name: '404',
    component: () => import('./views/error/404.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
