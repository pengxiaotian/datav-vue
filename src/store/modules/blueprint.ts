import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { DataVComponentInternalInstance } from '@/typings/datav'

config.rawError = true

/* region interfaces */

export interface IBlueprintState {
  flows: any[]
  datavComponents: Record<string, DataVComponentInternalInstance>
}

/* endregion */

@Module({ dynamic: true, store, name: 'blueprint' })
class Blueprint extends VuexModule implements IBlueprintState {
  public flows: any[] = []

  public datavComponents: Record<string, DataVComponentInternalInstance> = {}

  @Mutation
  public setDatavComponentInstance(payload: { key: string; ins: DataVComponentInternalInstance; }) {
    this.datavComponents[payload.key] = payload.ins
  }

  @Mutation
  public removeDatavComponent(key: string) {
    delete this.datavComponents[key]
  }

  @Mutation
  private SET_FLOWS(payload: any[]) {
    this.flows = payload
  }

  @Action
  public async setFlows(payload: any[]) {
    this.SET_FLOWS(payload)
  }

  @Action
  public async onApiRequestCompleted() {
    // TODO: some code
  }
}

export const BlueprintModule = getModule(Blueprint)
