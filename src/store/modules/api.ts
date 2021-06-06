import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { FieldStatus, ApiConfigMap, ApiConfig, ApiDataConfig } from '@/components/data-source'
import { ApiType } from '@/utils/enums/data-source'
import { isUrl, toJson } from '@/utils/util'
import dcRequest from '@/utils/dc-request'

config.rawError = true

/* region interfaces */

type ApiKeyName = keyof ApiConfigMap

type ApiData = Partial<Record<ApiKeyName, any>>

type ApiFieldStatus = Partial<Record<ApiKeyName, Record<string, FieldStatus>>>

export interface IApiState {
  dataMap: Record<string, ApiData>
  fieldStatusMap: Record<string, ApiFieldStatus>
}

/* endregion */

@Module({ dynamic: true, store, name: 'api' })
class Api extends VuexModule implements IApiState {
  public dataMap: Record<string, ApiData> = {}

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
      if (isUrl(config.api)) {
        try {
          res = await dcRequest.get(config.api)
        } catch {
          res = []
        }
      }
    }

    return toJson(res, [])
  }
}

export const ApiModule = getModule(Api)
