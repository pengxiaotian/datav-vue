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
  if (filterConfigs && filterConfigs.length > 0) {
    let res = data
    try {
      filterConfigs.forEach(({ id, enabled }) => {
        if (enabled) {
          const df = dataFilters.find(m => m.id === id)
          if (df) {
            const func = new Function('data', df.code)
            res = func(res)
          }
        }
      })
    } catch (error) {
      return error
    }

    return res
  }

  return data
}
