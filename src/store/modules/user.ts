import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { login, logout, getInfo } from '@/api/user'
import { setToken, removeToken } from '@/utils/token-util'

config.rawError = true

/* region interfaces */

export interface IUserState {
  token: string
  name: string
  avatar: string
  role: number
}

/* endregion */

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = 'value'
  public name = ''
  public avatar = ''
  public role = -1

  @Mutation
  private SET_TOKEN(payload: string) {
    this.token = payload
  }

  @Mutation
  private SET_USER_INFO(payload: IUserState) {
    this.name = payload.name
    this.avatar = payload.avatar
    this.role = payload.role
  }

  @Action
  public async login(payload: { username: string; password: string; }) {
    try {
      const res = await login(payload.username, payload.password)
      if (res.data.code === 0) {
        this.SET_TOKEN(res.data.data)
        setToken(res.data.data)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async getUserInfo() {
    try {
      const res = await getInfo()
      if (res.data.code === 0) {
        this.SET_USER_INFO(res.data.data)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async resetToken() {
    this.SET_TOKEN('')
    removeToken()
  }

  @Action
  public async logout() {
    logout().then(() => {
      this.resetToken()
    })
  }
}

export const UserModule = getModule(User)
