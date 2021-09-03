import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { globalConfig } from '@/config'
import { getToken } from '@/utils/token-util'
import { UserStore } from '@/domains/user'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/screen/:screenId',
    name: 'Screen',
    props: true,
    component: () => import('@/views/screen/index.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/index.vue'),
    meta: { title: '找不到页面' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


const whiteList = ['/login', '/auth-redirect', '/dev'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // set page title
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} | ${globalConfig.title}`
  } else {
    document.title = globalConfig.title
  }

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const { role, getUserInfo, resetToken } = UserStore()
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
  } else if (whiteList.some(m => to.path.startsWith(m))) {
    next()
  } else {
    next(`/login?redirect=${to.path}`)
  }
})


export default router
