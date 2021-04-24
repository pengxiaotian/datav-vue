import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { DataFilter } from '@/components/data-filter'

config.rawError = true

/* region interfaces */

export interface IFilterState {
  dataFilters: DataFilter[]
}

/* endregion */

@Module({ dynamic: true, store, name: 'filter' })
class Filter extends VuexModule implements IFilterState {
  public dataFilters: DataFilter[] = []

  @Mutation
  private LOAD_FILTERS(payload: DataFilter[]) {
    this.dataFilters = payload
  }

  @Action
  public loadFilters(projectId: string) {
    console.log(projectId)
    this.LOAD_FILTERS([])
  }
}

export const FilterModule = getModule(Filter)
