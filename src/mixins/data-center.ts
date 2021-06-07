import { ref, toRefs, watch, onUnmounted } from 'vue'
import { MessageUtil } from '@/utils/message-util'
import { isPlainObject, isArray } from '@/utils/util'
import { FilterModule } from '@/store/modules/filter'
import { ToolbarModule } from '@/store/modules/toolbar'
import { ApiModule } from '@/store/modules/api'
import { DatavComponent } from '@/components/datav-component'
import { ApiConfig, ApiDataConfig, FieldConfig, FieldStatus } from '@/components/data-source'
import { execFilter } from '@/components/data-filter'

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (val: any, key: string) => hasOwnProperty.call(val, key)

export const getFieldMap = (fields: Record<string, FieldConfig>) => {
  const fieldMap: Record<string, string> = Object.create(null)
  for (const [key, fc] of Object.entries(fields)) {
    fieldMap[key] = fc.map || key
  }
  return fieldMap
}

export const setFieldLoading = (fields: Record<string, FieldConfig>) => {
  return Object.keys(fields)
    .reduce((prev, curr) => {
      prev[curr] = FieldStatus.loading
      return prev
    }, Object.create(null)) as Record<string, FieldStatus>
}

export const checkDataSchema = (data: any, fields: Record<string, FieldConfig>) => {
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

export const setDatavData = async (comId: string, sourceName: string, aConfig: ApiConfig, adConfig: ApiDataConfig) => {
  ToolbarModule.addLoading()

  ApiModule.setFieldStatus({
    comId,
    fields: {
      [sourceName]: setFieldLoading(aConfig.fields),
    },
  })

  let res = await ApiModule.requestData({ comId, aConfig, adConfig })

  const { config, render } = aConfig
  if (config.useFilter) {
    res = execFilter(FilterModule.dataFilters, config.pageFilters, res)
  }

  if (render === 'render') {
    ApiModule.setData({ comId, data: { [sourceName]: res } })
  } else {
    MessageUtil.error(`${render} is not a function`)
  }

  // TODO: remove mock
  setTimeout(() => {
    ApiModule.setFieldStatus({
      comId,
      fields: {
        [sourceName]: checkDataSchema(res, aConfig.fields),
      },
    })
    ToolbarModule.removeLoading()
  }, 3000)
}

export const useDataCenter = (com: DatavComponent) => {
  const { apis, apiData } = toRefs(com)
  const timers = ref<number[]>([])

  onUnmounted(() => {
    timers.value.forEach(t => clearInterval(t))
  })

  for (const [name, ac] of Object.entries(apis.value)) {
    const adc = apiData.value[name]
    // 自动更新
    if (ac.useAutoUpdate && ac.autoUpdate > 0) {
      let timer = setInterval(
        <TimerHandler>(() => {
          if (!ac.useAutoUpdate) {
            clearInterval(timer)
            timer = null
          }

          setDatavData(com.id, name, ac, adc)
        }),
        ac.autoUpdate * 1000,
      )
      timers.value.push(timer)
    }

    watch([ac, adc], () => {
      setDatavData(com.id, name, ac, adc)
    }, {
      deep: true,
      immediate: true,
    })
  }
}
