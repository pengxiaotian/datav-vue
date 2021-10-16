import { ref, toRefs, watch, onUnmounted, getCurrentInstance } from 'vue'
import { debounce } from 'lodash-es'
import { isPlainObject, isArray } from '@/utils/util'
import { EditorModule } from '@/store/modules/editor'
import { FilterModule } from '@/store/modules/filter'
import { ToolbarModule } from '@/store/modules/toolbar'
import { ApiModule } from '@/store/modules/api'
import { DebugModule } from '@/store/modules/debug'
import { DatavComponent } from '@/components/datav-component'
import { FieldConfig } from '@/components/data-field'
import { ApiConfig, ApiDataConfig, FieldStatus } from '@/components/data-source'
import { execFilter } from '@/components/data-filter'
import { DatavError } from '@/domains/error'
import { BlueprintModule } from '@/store/modules/blueprint'
import { DataVComponentInternalInstance } from '@/typings/datav'

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (val: any, key: string) => hasOwnProperty.call(val, key)

export const getFieldMap = (fields: Record<string, FieldConfig>) => {
  const fieldMap: Record<string, string> = Object.create(null)
  for (const [key, fc] of Object.entries(fields)) {
    fieldMap[key] = fc.map || key
  }
  return fieldMap
}

const setFieldStatus = (fields: Record<string, FieldConfig>, status: FieldStatus) => {
  return Object.keys(fields)
    .reduce((prev, curr) => {
      prev[curr] = status
      return prev
    }, Object.create(null)) as Record<string, FieldStatus>
}

const checkDataSchema = (data: any, fields: Record<string, FieldConfig>) => {
  let _data = null
  if (isPlainObject(data)) {
    _data = data
  } else if (isArray(data)) {
    _data = data[0]
  }

  return Object.entries(fields)
    .reduce((prev, [key, fc]) => {
      if (_data && hasOwn(_data, fc.map || key)) {
        prev[key] = FieldStatus.success
      } else if (fc.optional) {
        prev[key] = FieldStatus.optional
      } else {
        prev[key] = FieldStatus.failed
      }
      return prev
    }, Object.create(null)) as Record<string, FieldStatus>
}

export const setDatavData = async (comId: string, apiName: string, aConfig: ApiConfig, adConfig: ApiDataConfig) => {
  ToolbarModule.addLoading()

  // 初始化字段状态
  DebugModule.setFieldStatus({
    comId,
    fields: {
      [apiName]: setFieldStatus(aConfig.fields, FieldStatus.loading),
    },
  })

  // 初始化数据状态
  DebugModule.setDataStatus({ comId, data: { [apiName]: null } })

  let isError = false
  let res: any

  try {
    // 获取源数据
    res = await ApiModule.requestData({ comId, aConfig, adConfig })
    DebugModule.setOrigin({ comId, data: { [apiName]: res } })
  } catch (error) {
    isError = true
    res = { isError, message: `${error}` }
    DebugModule.setDataStatus({
      comId,
      data: {
        [apiName]: { api: res.message },
      },
    })
  }

  if (!isError) {
    try {
      // 使用过滤器筛选数据
      if (adConfig.config.useFilter) {
        res = execFilter(FilterModule.dataFilters, adConfig.pageFilters, res)
      }
    } catch (error) {
      isError = true
      res = { isError, message: `${error}` }
      const targetId = error instanceof DatavError ? error.cause.targetId : 0
      DebugModule.setDataStatus({
        comId,
        data: {
          [apiName]: {
            filter: { [targetId]: error.message },
          },
        },
      })
    }
  }

  if (isError) {
    // @ts-expect-error
    window.$message.error(res.message)
  }

  // 传入组件的数据
  ApiModule.setData({ comId, data: { [apiName]: res } })

  // 当数据接口请求完成时
  // BlueprintModule.onApiRequestCompleted()

  // TODO: remove mock
  setTimeout(() => {
    DebugModule.setFieldStatus({
      comId,
      fields: {
        [apiName]: isError
          ? setFieldStatus(aConfig.fields, FieldStatus.failed)
          : checkDataSchema(res, aConfig.fields),
      },
    })
    ToolbarModule.removeLoading()
  }, 3000)
}

export const useDataCenter = (com: DatavComponent) => {
  const instance = getCurrentInstance() as DataVComponentInternalInstance
  const { apis, apiData } = toRefs(com)
  const timers = ref<number[]>([])

  const autoRefreshData = () => {
    for (const [name, ac] of Object.entries(apis.value)) {
      if (ac.useAutoUpdate && ac.autoUpdate > 0) {
        const timer = setInterval(
          <TimerHandler>(() => {
            setDatavData(com.id, name, ac, apiData.value[name])
          }),
          ac.autoUpdate * 1000,
        )
        timers.value.push(timer)
      }
    }
  }

  const stopAutoRefreshData = () => {
    timers.value.forEach(t => clearInterval(t))
  }

  // 订阅的变量发生变化时刷新
  const onSubVariablesChange = (fields: Record<string, string>) => {
    const sv = EditorModule.variables.subscribersView
    for (const fname in fields) {
      const key = fields[fname] || fname
      sv[key]?.forEach(comId => {
        BlueprintModule.datavComponents[comId]?.$DATAV_requestData()
      })
    }
  }

  const datavEmit = (eventName: string, data: Record<string, any>) => {
    const cv = EditorModule.variables.componentsView[com.id]
    if (!cv) {
      return
    }
    const eventItem = cv[eventName]
    if (eventItem && eventItem.enable) {
      ApiModule.setVariables({ fields: eventItem.fields, data })
      onSubVariablesChange(eventItem.fields)
    }
  }

  for (const [name, ac] of Object.entries(apis.value)) {
    const adc = apiData.value[name]
    watch([ac, () => adc.type, adc.config], () => {
      setDatavData(com.id, name, ac, adc)
    }, {
      deep: true,
      immediate: true,
    })
  }

  if (!EditorModule.editMode) {
    autoRefreshData()
  }

  onUnmounted(() => {
    stopAutoRefreshData()
    BlueprintModule.removeDatavComponent(com.id)
  })

  // ------初始化默认公共动作------
  instance.$DATAV_requestData = debounce(() => {
    stopAutoRefreshData()

    const arr: Promise<void>[] = []
    for (const [name, ac] of Object.entries(apis.value)) {
      arr.push(setDatavData(com.id, name, ac, apiData.value[name]))
    }
    Promise.all(arr).then(() => {
      autoRefreshData()
    })
  }, 300)

  // 保存每个组件实例
  BlueprintModule.setDatavComponentInstance({ key: com.id, ins: instance })

  return {
    datavEmit,
  }
}
