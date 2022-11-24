import { ref, toRefs, watch, onUnmounted } from 'vue'
import { debounce, isPlainObject, isArray } from 'lodash-es'
import { hasOwn } from '@/utils/util'
import { useMessageUtil } from '@/utils/naive-ui-util'
import { useEditorStore } from '@/store/editor'
import { useFilterStore } from '@/store/filter'
import { useToolbarStore } from '@/store/toolbar'
import { useApiStore } from '@/store/api'
import { useDebugStore } from '@/store/debug'
import { useBlueprintStore } from '@/store/blueprint'
import { DatavComponent } from '@/components/_models/datav-component'
import { FieldConfig } from '@/components/_models/data-field'
import { ApiKeyName, ApiConfig, ApiDataConfig, FieldStatus } from '@/components/_models/data-source'
import { execFilter } from '@/components/_models/data-filter'

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

export const setComponentData = async (
  comId: string,
  apiKey: ApiKeyName,
  aConfig: ApiConfig,
  adConfig: ApiDataConfig,
) => {
  const apiStore = useApiStore()
  const toolbarStore = useToolbarStore()
  const filterStore = useFilterStore()
  const debugStore = useDebugStore()
  toolbarStore.addLoading()

  // 初始化字段状态
  debugStore.setFieldStatus(comId, apiKey, setFieldStatus(aConfig.fields, FieldStatus.loading))

  let isError = false
  let res: any

  try {
    // 获取源数据
    res = await apiStore.requestData(comId, aConfig, adConfig)
    debugStore.setOrigin(comId, apiKey, res)
  } catch (error) {
    isError = true
    res = { isError, message: error.message }
    debugStore.setDataStatus(comId, apiKey, 'api', res.message)
  }

  if (!isError) {
    try {
      // 使用过滤器筛选数据
      if (adConfig.config.useFilter) {
        res = execFilter(filterStore.dataFilters, adConfig.pageFilters, res)
      } else {
        debugStore.setDataStatus(comId, apiKey, 'filter', '')
      }
    } catch (error) {
      isError = true
      res = { isError, message: error.message }
      debugStore.setDataStatus(comId, apiKey, 'filter', res.message)
    }
  }

  if (isError) {
    useMessageUtil().error(res.message)
  }

  // 传入组件的数据
  apiStore.setData(comId, apiKey, res)

  // 当数据接口请求完成时
  // blueprintStore.onApiRequestCompleted()

  // TODO: remove mock
  setTimeout(() => {
    debugStore.setFieldStatus(
      comId,
      apiKey,
      isError
        ? setFieldStatus(aConfig.fields, FieldStatus.failed)
        : checkDataSchema(res, aConfig.fields),
    )
    toolbarStore.removeLoading()
  }, 3000)
}

export const useDataCenter = (com: DatavComponent) => {
  const editorStore = useEditorStore()
  const blueprintStore = useBlueprintStore()

  const { apis, apiData } = toRefs(com)
  const apiKeys = Object.keys(com.apis) as ApiKeyName[]
  const timers = ref<number[]>([])

  const autoRefreshData = (apiKey: ApiKeyName, ac: ApiConfig) => {
    if (ac.useAutoUpdate && ac.autoUpdate > 0) {
      const timer = window.setInterval(() => {
        setComponentData(com.id, apiKey, ac, apiData.value[apiKey])
      }, ac.autoUpdate * 1000)
      timers.value.push(timer)
    }
  }

  const autoRefreshAllData = () => {
    apiKeys.forEach(apiKey => {
      autoRefreshData(apiKey, apis.value[apiKey])
    })
  }

  const initData = (apiKey: ApiKeyName, ac: ApiConfig) => {
    const adc = apiData.value[apiKey]
    watch([ac, () => adc.type, adc.config], () => {
      setComponentData(com.id, apiKey, ac, adc)
    }, {
      deep: true,
      immediate: true,
    })
  }

  const stopAutoRefreshAllData = () => {
    timers.value.forEach(t => stopAutoRefreshData(t))
  }

  const stopAutoRefreshData = (id?: number) => {
    clearInterval(id)
  }

  const initAllData = () => {
    apiKeys.forEach(apiKey => {
      initData(apiKey, apis.value[apiKey])
    })
  }

  initAllData()

  if (!editorStore.editMode) {
    autoRefreshAllData()
  }

  onUnmounted(() => {
    stopAutoRefreshAllData()
    blueprintStore.clearEvent(com.id)
  })

  // ------初始化默认公共动作------
  const requestData = debounce(() => {
    stopAutoRefreshAllData()

    const arr = apiKeys.map(apiKey => setComponentData(com.id, apiKey, apis.value[apiKey], apiData.value[apiKey]))
    Promise.all(arr).then(() => {
      autoRefreshAllData()
    })
  }, 300)

  blueprintStore.setEvent(com.id, 'requestData', requestData)
}
