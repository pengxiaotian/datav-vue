import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { ApiKeyName, FieldStatus } from '@/components/data-source'

config.rawError = true

/* region interfaces */

type ApiData = Partial<Record<ApiKeyName, any>>

export type ApiDataStatus = Partial<Record<ApiKeyName, any>>

export type ApiFieldStatus = Partial<Record<ApiKeyName, Record<string, FieldStatus>>>

export interface IDebugState {
  debug: boolean
  originMap: Record<string, ApiData>
  dataStatusMap: Record<string, ApiDataStatus>
  fieldStatusMap: Record<string, ApiFieldStatus>
}

/* endregion */

@Module({ dynamic: true, store, name: 'debug' })
class Debug extends VuexModule implements IDebugState {
  public debug = false

  public originMap: Record<string, ApiData> = {}

  public dataStatusMap: Record<string, ApiDataStatus> = {}

  public fieldStatusMap: Record<string, ApiFieldStatus> = {}

  @Mutation
  public enableDebug() {
    this.debug = true
  }

  @Mutation
  public stopDebug() {
    this.debug = false
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
    for (const [keyName, value] of Object.entries(payload.data)) {
      if (this.dataStatusMap[payload.comId]) {
        this.dataStatusMap[payload.comId][keyName] = value
      } else {
        this.dataStatusMap[payload.comId] = { [keyName]: value }
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
  public async setOrigin(payload: { comId: string; data: ApiData; }) {
    if (this.debug) {
      this.SET_ORIGIN(payload)
    }
  }

  @Action
  public async setDataStatus(payload: { comId: string; data: ApiDataStatus; }) {
    if (this.debug) {
      this.SET_DATA_STATUS(payload)
    }
  }

  @Action
  public async setFieldStatus(payload: { comId: string; fields: ApiFieldStatus; }) {
    if (this.debug) {
      this.SET_FIELD_STATUS(payload)
    }
  }
}

export const DebugModule = getModule(Debug)
