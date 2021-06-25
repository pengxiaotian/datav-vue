import { DatavError } from '@/domains/error'

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
      throw new DatavError('过滤器执行错误', error.toString(), {
        targetId,
        origin: error,
      })
    }

    return res
  }

  return data
}
