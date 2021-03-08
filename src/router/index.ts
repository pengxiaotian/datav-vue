import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { config } from '@/config'
import { getToken } from '@/utils/token-util'
// import { UserModule } from '@/store/modules/user'
import { userStore } from '@/domains/user'

export const navRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
]

const routes: Array<RouteRecordRaw> = [
  ...navRoutes,
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // set page title
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} | ${config.title}`
  } else {
    document.title = config.title
  }

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const { role, getUserInfo, resetToken } = userStore()
      if (role.value > 0) {
        next()
      } else {
        try {
          await getUserInfo()
          next({ ...to, replace: true })
        } catch (error) {
          resetToken()
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    next(`/login?redirect=${to.path}`)
  }
})


export default router
