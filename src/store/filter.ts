import { defineStore } from 'pinia'
import { DataFilter } from '@/components/_models/data-filter'
import * as api from '@/api/filter'
import dayjs from 'dayjs'

export interface IFilterState {
  dataFilters: DataFilter[]
}

export const useFilterStore = defineStore('filter', {
  state: (): IFilterState => ({
    dataFilters: [],
  }),
  actions: {
    async request(projectId: number) {
      try {
        const res = await api.getFilters(projectId)
        if (res.data.code === 0) {
          this.dataFilters = res.data.data
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async create(payload: DataFilter) {
      try {
        const res = await api.createFilter(payload)
        if (res.data.code === 0) {
          payload.id = res.data.data
          payload.createAt = dayjs().format('YYYY-MM-DD HH:mm:ss'),
          payload.updateAt = payload.createAt
          this.dataFilters.push(payload)
          return res.data.data as number
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async update(payload: DataFilter) {
      try {
        const res = await api.updateFilter(payload)
        if (res.data.code === 0) {
          const df = this.dataFilters.find(m => m.id === payload.id)
          Object.assign(df, {
            name: payload.name,
            code: payload.code,
            origin: payload.origin,
            updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          })
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async updateName(payload: Pick<DataFilter, 'id' | 'name'>) {
      try {
        const res = await api.updateFilterName(payload)
        if (res.data.code === 0) {
          const df = this.dataFilters.find(m => m.id === payload.id)
          Object.assign(df, {
            name: payload.name,
            updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          })
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async delete(payload: number) {
      try {
        const res = await api.deleteFilter(payload)
        if (res.data.code === 0) {
          const index = this.dataFilters.findIndex(m => m.id === payload)
          this.dataFilters.splice(index, 1)
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
  },
})
