import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { ApiKeyName, ApiConfig, ApiDataConfig, ApiType, ApiRequestMethod } from '@/components/data-source'
import { isUrl, toJson, replaceTextParams } from '@/utils/util'
import dcRequest from '@/utils/dc-request'

config.rawError = true

/* region interfaces */

type ApiData = Partial<Record<ApiKeyName, any>>

export interface IApiState {
  dataMap: Record<string, ApiData>
  variables: Record<string, any>
}

/* endregion */

@Module({ dynamic: true, store, name: 'api' })
class Api extends VuexModule implements IApiState {
  public dataMap: Record<string, ApiData> = {}

  public variables: Record<string, any> = {}

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

  @Mutation
  private SET_VARIABLES(payload: Record<string, any>) {
    this.variables = {
      ...this.variables,
      ...payload,
    }
  }

  @Action
  public async setData(payload: { comId: string; data: ApiData; }) {
    this.SET_DATA(payload)
  }

  @Action
  public async setVariables(payload: { fields: Record<string, string>; data: Record<string, any>; }) {
    const res = {}
    for (const key in payload.fields) {
      const alias = payload.fields[key] || key
      res[alias] = payload.data[key]
    }
    this.SET_VARIABLES(res)
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

        const url = replaceTextParams(config.api, this.variables)
        if (config.apiMethod === ApiRequestMethod.GET) {
          res = await dcRequest.get(url, conf)
        } else {
          res = await dcRequest.post(url, toJson(config.apiBody, {}), conf)
        }
      } catch {
        throw Error('connectFailed')
      }
    }

    return toJson(res, [])
  }
}

export const ApiModule = getModule(Api)
