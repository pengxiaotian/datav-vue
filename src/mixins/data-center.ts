
import { ref, toRefs, watchEffect, onUnmounted } from 'vue'
import { isUrl, toJson } from '@/utils/util'
import dcRequest from '@/utils/dc-request'
import { MessageUtil } from '@/utils/message-util'
import { FilterModule } from '@/store/modules/filter'
import { DatavComponent } from '@/components/datav-component'
import { DataSourceType } from '@/components/enums/data-source'
import { SourceConfig, DataConfig } from '@/components/data-source'
import { execFilter } from '@/components/data-filter'
import { getRenderData } from '@/components/data-render'

export const useDataCenter = (com: DatavComponent) => {
  const { data, source } = toRefs(com)
  const timers = ref<number[]>([])
  const datav_data = ref<Record<string, any>>({})

  onUnmounted(() => {
    timers.value.forEach(t => clearInterval(t))
  })

  const toData = async (dataName: string, scConfig: SourceConfig, dataConfig: DataConfig) => {
    const { type, config } = scConfig
    let res: unknown = []
    if (type === DataSourceType.static) {
      res = config.data
    } else if (type === DataSourceType.api && isUrl(config.api)) {
      try {
        res = await dcRequest.get(config.api)
      } catch {
        res = []
      }
    }

    res = toJson(res, [])

    const { dcConfig, render } = dataConfig
    if (dcConfig.useFilter) {
      res = execFilter(FilterModule.dataFilters, dcConfig.pageFilters, res)
    }

    if (render === 'render') {
      datav_data.value[dataName] = getRenderData(res, dataConfig.fields)
    } else {
      MessageUtil.error(`${render} is not a function`)
    }
  }

  for (const [name, dc] of Object.entries(data.value)) {
    // 自动更新
    if (dc.useAutoUpdate && dc.autoUpdate > 0) {
      const handler: TimerHandler = () => {
        toData(name, source.value[name], dc)
      }
      timers.value.push(setInterval(handler, dc.autoUpdate * 1000))
    }

    watchEffect(() => {
      toData(name, source.value[name], dc)
    })
  }

  return {
    datav_data,
  }
}
