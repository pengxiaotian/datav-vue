import { ref, toRefs, watch, onUnmounted } from 'vue'
import { MessageUtil } from '@/utils/message-util'
import { FilterModule } from '@/store/modules/filter'
import { ToolbarModule } from '@/store/modules/toolbar'
import { ApiModule } from '@/store/modules/api'
import { DatavComponent } from '@/components/datav-component'
import { ApiConfig, ApiDataConfig } from '@/components/data-source'
import { execFilter } from '@/components/data-filter'
import { setFieldLoading, checkDataSchema, getRenderData } from '@/components/data-render'

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
    ApiModule.setData({
      comId,
      data: {
        [sourceName]: getRenderData(res, aConfig.fields),
      },
    })
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
