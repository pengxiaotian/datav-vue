import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { FieldStatus, ApiConfigMap, ApiConfig, ApiDataConfig, ApiType, ApiRequestMethod } from '@/components/data-source'
import { isUrl, toJson } from '@/utils/util'
import dcRequest from '@/utils/dc-request'

config.rawError = true

/* region interfaces */

type ApiKeyName = keyof ApiConfigMap

type ApiData = Partial<Record<ApiKeyName, any>>

type ApiDataStatus = Record<string, boolean>

type ApiFieldStatus = Partial<Record<ApiKeyName, Record<string, FieldStatus>>>

export interface IApiState {
  dataMap: Record<string, ApiData>
  originMap: Record<string, ApiData>
  dataStatusMap: Record<string, ApiDataStatus>
  fieldStatusMap: Record<string, ApiFieldStatus>
}

/* endregion */

@Module({ dynamic: true, store, name: 'api' })
class Api extends VuexModule implements IApiState {
  public dataMap: Record<string, ApiData> = {}

  public originMap: Record<string, ApiData> = {}

  public dataStatusMap: Record<string, ApiDataStatus> = {}

  public fieldStatusMap: Record<string, ApiFieldStatus> = {}

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
  private SET_ORIGIN(payload: { comId: string; data: ApiData; }) {
    for (const [keyName, value] of Object.entries(payload.data)) {
      if (this.originMap[payload.comId]) {
        this.originMap[payload.comId][keyName] = value
      } else {
        this.originMap[payload.comId] = { [keyName]: value }
      }
    }
  }

  @Mutation
  private SET_DATA_STATUS(payload: { comId: string; data: ApiDataStatus; }) {
    this.dataStatusMap[payload.comId] = payload.data
  }

  @Mutation
  private SET_FIELD_STATUS(payload: { comId: string; fields: ApiFieldStatus; }) {
    for (const [keyName, value] of Object.entries(payload.fields)) {
      if (this.fieldStatusMap[payload.comId]) {
        this.fieldStatusMap[payload.comId][keyName] = value
      } else {
        this.fieldStatusMap[payload.comId] = { [keyName]: value }
      }
    }
  }

  @Action
  public async setData(payload: { comId: string; data: ApiData; }) {
    this.SET_DATA(payload)
  }

  @Action
  public async setOrigin(payload: { comId: string; data: ApiData; }) {
    this.SET_ORIGIN(payload)
  }

  @Action
  public async setDataStatus(payload: { comId: string; data: ApiDataStatus; }) {
    this.SET_DATA_STATUS(payload)
  }

  @Action
  public async setFieldStatus(payload: { comId: string; fields: ApiFieldStatus; }) {
    this.SET_FIELD_STATUS(payload)
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
