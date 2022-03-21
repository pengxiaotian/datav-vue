import { defineStore } from 'pinia'
import { login, logout, getInfo } from '@/api/user'

const TokenKey = 'DataV-Token'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    name: '',
    avatar: '',
    role: -1,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const res = await login(username, password)
        if (res.data.code === 0) {
          this.token = res.data.data
          localStorage.setItem(TokenKey, res.data.data)
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async getUserInfo() {
      try {
        const res = await getInfo()
        if (res.data.code === 0) {
          const { data } = res.data
          this.name = data.name
          this.avatar = data.avatar
          this.role = data.role
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    resetToken() {
      this.token = ''
      localStorage.removeItem(TokenKey)
    },
    isLogin() {
      const token = localStorage.getItem(TokenKey)
      return !!token
    },
    async logout() {
      await logout()
      this.resetToken()
    },
  },
})
