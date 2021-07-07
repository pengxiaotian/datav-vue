import { ref, toRefs, watch, onUnmounted } from 'vue'
import { MessageUtil } from '@/utils/message-util'
import { isPlainObject, isArray } from '@/utils/util'
import { EditorModule } from '@/store/modules/editor'
import { FilterModule } from '@/store/modules/filter'
import { ToolbarModule } from '@/store/modules/toolbar'
import { ApiModule } from '@/store/modules/api'
import { DatavComponent } from '@/components/datav-component'
import { FieldConfig } from '@/components/data-field'
import { ApiConfig, ApiDataConfig, FieldStatus } from '@/components/data-source'
import { execFilter } from '@/components/data-filter'
import { DatavError } from '@/domains/error'

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

export const setDatavData = async (comId: string, sourceName: string, aConfig: ApiConfig, adConfig: ApiDataConfig) => {
  ToolbarModule.addLoading()

  // 初始化字段状态
  ApiModule.setFieldStatus({
    comId,
    fields: {
      [sourceName]: setFieldStatus(aConfig.fields, FieldStatus.loading),
    },
  })

  // 初始化数据状态
  ApiModule.setDataStatus({ comId, data: { [sourceName]: {} } })

  let isError = false
  let res: any

  try {
    // 获取源数据
    res = await ApiModule.requestData({ comId, aConfig, adConfig })

    // 只在编辑模式下保存源数据
    if (EditorModule.editMode) {
      ApiModule.setOrigin({ comId, data: { [sourceName]: res } })
    }
  } catch (error) {
    isError = true
    res = { isError, message: `${error}` }
    ApiModule.setDataStatus({ comId, data: { [sourceName]: { errSource: res.message } } })
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
      ApiModule.setDataStatus({
        comId,
        data: {
          [sourceName]: {
            errFilter: { [targetId]: error.message },
          },
        },
      })
    }
  }

  if (isError) {
    MessageUtil.error(res.message)
  }

  if (aConfig.render === 'render') {
    ApiModule.setData({ comId, data: { [sourceName]: res } })
  } else {
    MessageUtil.error(`${aConfig.render} is not a function`)
  }

  // TODO: remove mock
  setTimeout(() => {
    ApiModule.setFieldStatus({
      comId,
      fields: {
        [sourceName]: isError
          ? setFieldStatus(aConfig.fields, FieldStatus.failed)
          : checkDataSchema(res, aConfig.fields),
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

    // not watch DataFilter
    watch([ac, () => adc.type, adc.config], () => {
      setDatavData(com.id, name, ac, adc)
    }, {
      deep: true,
      immediate: true,
    })
  }
}
