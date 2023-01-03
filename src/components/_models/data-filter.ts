import { throwError } from '@/utils/warn-util'

export interface FilterConfig {
  id: number
  enabled: boolean
}

export interface DataFilter {
  id: number
  name: string
  code: string
  origin: string
  projectId: number
  createAt: string
  updateAt: string
}

export function execFilter(dataFilters: DataFilter[], filterConfigs: FilterConfig[], data: any) {
  if (dataFilters.length && filterConfigs && filterConfigs.length) {
    let res = data
    let targetId = 0
    try {
      filterConfigs.forEach(({ id, enabled }) => {
        if (enabled) {
          const df = dataFilters.find(m => m.id === id)
          if (df) {
            targetId = id
            const func = new Function('data', df.code)
            res = func(res)
          }
        }
      })
    } catch (error) {
      throwError(`过滤器/${targetId}`, error.message)
    }

    return res
  }

  return data
}
