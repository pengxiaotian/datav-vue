import { ref, toRefs, watch, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store/editor'
import { useBlueprintStore } from '@/store/blueprint'
import { DatavComponent } from '@/components/_models/datav-component'
import { FieldConfig } from '@/components/_models/data-field'
import { ApiKeyName, ApiConfig } from '@/components/_models/data-source'
import { setComponentData } from '../_utils/set-component-data'

export const getFieldMap = (fields: Record<string, FieldConfig>) => {
  const fieldMap: Record<string, string> = Object.create(null)
  for (const [key, fc] of Object.entries(fields)) {
    fieldMap[key] = fc.map || key
  }
  return fieldMap
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
    for (const apiKey of apiKeys) {
      autoRefreshData(apiKey, apis.value[apiKey])
    }
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

  const stopAutoRefreshData = (id?: number) => {
    clearInterval(id)
  }

  const stopAutoRefreshAllData = () => {
    timers.value.forEach(t => stopAutoRefreshData(t))
  }

  const initAllData = () => {
    for (const apiKey of apiKeys) {
      initData(apiKey, apis.value[apiKey])
    }
  }

  initAllData()

  if (!editorStore.editMode) {
    autoRefreshAllData()
  }

  onUnmounted(() => {
    stopAutoRefreshAllData()
    blueprintStore.clearEvent(com.id)
  })

  // 当数据接口请求完成时
  // blueprintStore.onApiRequestCompleted()

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
