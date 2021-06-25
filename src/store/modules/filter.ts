import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import dayjs from 'dayjs'
import store from '@/store'
import { DataFilter } from '@/components/data-filter'
import * as api from '@/api/filter'

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

  @Mutation
  private CREATE_FILTER(payload: DataFilter) {
    this.dataFilters.push(payload)
  }

  @Mutation
  private UPDATE_FILTER(payload: DataFilter) {
    const df = this.dataFilters.find(m => m.id === payload.id)
    Object.assign(df, {
      name: payload.name,
      code: payload.code,
      origin: payload.origin,
      updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
  }

  @Mutation
  private UPDATE_FILTER_NAME(payload: Pick<DataFilter, 'id' | 'name'>) {
    const df = this.dataFilters.find(m => m.id === payload.id)
    Object.assign(df, {
      name: payload.name,
      updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
  }

  @Mutation
  private DELETE_FILTER(payload: number) {
    const index = this.dataFilters.findIndex(m => m.id === payload)
    this.dataFilters.splice(index, 1)
  }

  @Action
  public async loadFilters(payload: number) {
    try {
      const res = await api.getFilters(payload)
      if (res.data.code === 0) {
        this.LOAD_FILTERS(res.data.data)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async createFilter(payload: DataFilter) {
    try {
      const res = await api.createFilter(payload)
      if (res.data.code === 0) {
        payload.id = res.data.data
        this.CREATE_FILTER(payload)
        return res.data.data as number
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async updateFilter(payload: DataFilter) {
    try {
      const res = await api.updateFilter(payload)
      if (res.data.code === 0) {
        this.UPDATE_FILTER(payload)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async updateFilterName(payload: Pick<DataFilter, 'id' | 'name'>) {
    try {
      const res = await api.updateFilterName(payload)
      if (res.data.code === 0) {
        this.UPDATE_FILTER_NAME(payload)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  @Action
  public async deleteFilter(payload: number) {
    try {
      const res = await api.deleteFilter(payload)
      if (res.data.code === 0) {
        this.DELETE_FILTER(payload)
      } else {
        throw Error(res.data.message)
      }
    } catch (error) {
      throw error
    }
  }
}

export const FilterModule = getModule(Filter)
