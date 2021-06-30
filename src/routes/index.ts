import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { config } from '@/config'
import { getToken } from '@/utils/token-util'
import { UserStore } from '@/domains/user'

const navRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/project',
    component: () => import('@/views/home/index.vue'),
    children: [
      {
        path: 'project',
        name: 'MyProject',
        component: () => import('@/views/my-project/index.vue'),
        meta: { title: '我的可视化' },
      },
      {
        path: 'data',
        name: 'MyData',
        component: () => import('@/views/my-data/index.vue'),
        meta: { title: '我的数据' },
      },
      {
        path: 'com',
        name: 'MyCom',
        component: () => import('@/views/my-com/index.vue'),
        meta: { title: '我的组件' },
      },
      {
        path: 'case',
        name: 'MyCase',
        component: () => import('@/views/my-case/index.vue'),
        meta: { title: '教程' },
      },
    ],
  },
]

const routes: Array<RouteRecordRaw> = [
  ...navRoutes,
  {
    path: '/create-screen',
    name: 'CreateScreen',
    component: () => import('@/views/my-project/create-screen.vue'),
    meta: { title: '创建' },
  },
  {
    path: '/admin/screen/:projectId',
    name: 'ScreenEditor',
    props: true,
    component: () => import('@/views/screen/index.vue'),
    meta: { title: '编辑器' },
  },
  {
    path: '/screen/:screenId',
    name: 'Screen',
    props: true,
    component: () => import('@/views/preview/index.vue'),
    meta: { title: '...' },
  },
  {
    path: '/screen/preview/:screenId',
    name: 'Preview',
    props: true,
    component: () => import('@/views/preview/index.vue'),
    meta: { title: '预览' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/index.vue'),
    meta: { title: '找不到页面' },
  },
]

if (import.meta.env.DEV) {
  routes.unshift(
    {
      path: '/dev/props-config',
      name: 'DevPropsConfig',
      component: () => import('@/pages/props-config/index.vue'),
      meta: { title: '属性配置' },
    },
  )
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


const whiteList = ['/login', '/auth-redirect', '/dev'] // no redirect whitelist

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
  } else if (whiteList.some(m => to.path.startsWith(m))) {
    next()
  } else {
    next(`/login?redirect=${to.path}`)
  }
})


export default router
