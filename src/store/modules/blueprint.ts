import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'

config.rawError = true

/* region interfaces */

export interface IBlueprintState {
  flows: any[]
}

/* endregion */

@Module({ dynamic: true, store, name: 'blueprint' })
class Blueprint extends VuexModule implements IBlueprintState {
  public flows = []

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
