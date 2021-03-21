import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { config } from '@/config'
import { getToken } from '@/utils/token-util'
// import { UserModule } from '@/store/modules/user'
import { UserStore } from '@/domains/user'
import Home from '@/views/home/index.vue'

export const navRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/project',
    component: Home,
    meta: { title: '首页' },
    children: [
      {
        path: 'project',
        name: 'MyProject',
        component: () => import(/* webpackChunkName: "my-project" */ '@/views/my-project/index.vue'),
      },
      {
        path: 'data',
        name: 'MyData',
        component: () => import(/* webpackChunkName: "my-data" */ '@/views/my-data/index.vue'),
      },
      {
        path: 'com',
        name: 'MyCom',
        component: () => import(/* webpackChunkName: "my-com" */ '@/views/my-com/index.vue'),
      },
      {
        path: 'case',
        name: 'MyCase',
        component: () => import(/* webpackChunkName: "my-case" */ '@/views/my-case/index.vue'),
      },
    ],
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
  } else if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    next(`/login?redirect=${to.path}`)
  }
})


export default router
