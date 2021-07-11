import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { ApiKeyName, ApiConfig, ApiDataConfig, ApiType, ApiRequestMethod } from '@/components/data-source'
import { isUrl, toJson } from '@/utils/util'
import dcRequest from '@/utils/dc-request'

config.rawError = true

/* region interfaces */

type ApiData = Partial<Record<ApiKeyName, any>>

export interface IApiState {
  dataMap: Record<string, ApiData>
}

/* endregion */

@Module({ dynamic: true, store, name: 'api' })
class Api extends VuexModule implements IApiState {
  public dataMap: Record<string, ApiData> = {}

  @Mutation
  private SET_DATA(payload: { comId: string; data: ApiData; }) {
    for (const [keyName, value] of Object.entries(payload.data)) {
      if (this.dataMap[payload.comId]) {
        this.dataMap[payload.comId][keyName] = value
      } else {
        this.dataMap[payload.comId] = { [keyName]: value }
      }
    }
  }

  @Action
  public async setData(payload: { comId: string; data: ApiData; }) {
    this.SET_DATA(payload)
  }

  @Action
  public async requestData(payload: { comId: string; aConfig: ApiConfig; adConfig: ApiDataConfig; }) {
    const { type, config } = payload.adConfig
    let res: unknown
    if (type === ApiType.static) {
      res = config.data
    } else if (type === ApiType.api) {
      if (!config.api) {
        return []
      }

      if (!isUrl(config.api)) {
        throw Error('url must contains protocol field, like http:')
      }

      try {
        const conf = {
          headers: toJson(config.apiHeaders, {}),
          withCredentials: config.cookie,
        }
        if (config.apiMethod === ApiRequestMethod.GET) {
          res = await dcRequest.get(config.api, conf)
        } else {
          res = await dcRequest.post(config.api, toJson(config.apiBody, {}), conf)
        }
      } catch {
        throw Error('connectFailed')
      }
    }

    return toJson(res, [])
  }
}

export const ApiModule = getModule(Api)
