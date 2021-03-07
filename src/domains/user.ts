import { ref } from 'vue'
import { login, logout, getInfo } from '@/api/user'
import { setToken, removeToken } from '@/utils/token-util'


export const userStore = () => {
  const token = ref('')
  const name = ref('')
  const avatar = ref('')
  const role = ref(-1)

  const doLogin = async (username: string, password: string) => {
    try {
      const res = await login(username, password)
      if (res.data.code === 0) {
        token.value = res.data.data
        setToken(res.data.data)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await getInfo()
      if (res.data.code === 0) {
        const { data } = res.data
        name.value = data.name
        avatar.value = data.avatar
        role.value = data.role
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const resetToken = () => {
    token.value = ''
    removeToken()
  }

  const doLogout = () => {
    logout().then(() => {
      resetToken()
    })
  }

  return {
    token,
    name,
    avatar,
    role,
    doLogin,
    getUserInfo,
    resetToken,
    doLogout,
  }
}
