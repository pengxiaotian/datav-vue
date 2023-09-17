import { isPlainObject, isArray } from 'lodash-es'
import { hasOwn, sleep } from '@/utils/util'
import { useMessageUtil } from '@/utils/naive-ui-util'
import { useFilterStore } from '@/store/filter'
import { useToolbarStore } from '@/store/toolbar'
import { useApiStore } from '@/store/api'
import { useDebugStore } from '@/store/debug'
import { FieldConfig } from '@/components/_models/data-field'
import { ApiKeyName, ApiConfig, ApiDataConfig, FieldStatus } from '@/components/_models/data-source'
import { execFilter } from '@/components/_models/data-filter'

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

const setFieldStatus = (fields: Record<string, FieldConfig>, status: FieldStatus) => {
  return Object.keys(fields)
    .reduce((prev, curr) => {
      prev[curr] = status
      return prev
    }, Object.create(null)) as Record<string, FieldStatus>
}

export const setComponentData = async (
  comId: string,
  apiKey: ApiKeyName,
  apiCfg: ApiConfig,
  apiDataCfg: ApiDataConfig,
  options?: {
    onFinish?: () => void
  },
) => {
  const apiStore = useApiStore()
  const filterStore = useFilterStore()
  const debugStore = useDebugStore()
  const toolbarStore = useToolbarStore()
  toolbarStore.addLoading()

  //----------初始化字段状态----------
  debugStore.setFieldStatus(
    comId,
    apiKey,
    setFieldStatus(apiCfg.fields, FieldStatus.loading),
  )

  let isError = false
  let res = null

  //----------获取源数据----------
  try {
    res = await apiStore.requestData(apiDataCfg)
    debugStore.setOrigin(comId, apiKey, res)
  } catch (error) {
    isError = true
    res = { isError, message: error.message }
    debugStore.setDataStatus(comId, apiKey, 'api', res.message)
  }

  //----------使用过滤器筛选数据----------
  if (!isError) {
    try {
      if (apiDataCfg.config.useFilter) {
        res = execFilter(filterStore.dataFilters, apiDataCfg.pageFilters, res)
      }
    } catch (error) {
      isError = true
      res = { isError, message: error.message }
    }
    debugStore.setDataStatus(comId, apiKey, 'filter', isError ? res.message : '')
  }

  //----------如果有错误就提示----------
  if (isError) {
    useMessageUtil().error(res.message)
  }

  //----------保存要传入组件的数据----------
  apiStore.setData(comId, apiKey, res)

  //----------执行完成后----------
  options?.onFinish?.()

  // TODO: remove mock
  sleep(3000)

  toolbarStore.removeLoading()
  debugStore.setFieldStatus(
    comId,
    apiKey,
    isError ? setFieldStatus(apiCfg.fields, FieldStatus.failed)
      : checkDataSchema(res, apiCfg.fields),
  )
}
