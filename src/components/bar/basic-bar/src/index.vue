<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <v-chart :option="option" autoresize />
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { BasicBar } from './basic-bar'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
])

export default defineComponent({
  name: 'VBasicBar',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<BasicBar>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? []
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const getSeries = () => {
      const ydata: number[] = dv_data.value.map(m => m[dv_field.value.y])
      const { global, label, series } = config.value
      let arr = []
      series.forEach((item, i) => {
        arr.push({
          type: item.type,
          name: item.name,
          xAxisIndex: 1,
          zlevel: 1,
          z: 10 + i,
          itemStyle: {
            color: item.color.value,
          },
          label: {
            show: label.show,
            position: label.position,
            ...label.textStyle,
            offset: [label.offsetX, label.offsetY],
          },
          barGap: `${global.innerPadding}%`,
          barCategoryGap: `${global.outerPadding}%`,
          data: ydata,
        })
      })
      const maxNum = Math.max(...ydata)
      arr.push({
        type: 'bar',
        barWidth: `${100 - global.outerPadding}%`,
        data: Array.from({ length: ydata.length }, () => maxNum),
        itemStyle: {
          color: global.barColor,
        },
        silent: true,
      })
      return arr
    }

    const option = computed(() => {
      const xdata = dv_data.value.map(m => m[dv_field.value.x])
      const { global, xAxis, yAxis } = config.value
      const opts = {
        textStyle: {
          fontFamily: global.fontFamily,
        },
        grid: {
          ...global.margin,
        },
        tooltip: {},
        xAxis: [{
          type: 'category',
          position: 'top',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          data: xdata,
        }, {
          show: xAxis.show,
          type: 'category',
          axisLabel: {
            ...xAxis.textStyle,
            margin: xAxis.label.margin,
          },
          axisLine: {
            show: xAxis.axisLine.show,
            lineStyle: {
              color: xAxis.axisLine.color,
            },
          },
          axisTick: {
            show: xAxis.axisTick.show,
            lineStyle: {
              color: xAxis.axisTick.color,
            },
            alignWithLabel: true,
          },
          data: xdata,
        }],
        yAxis: {
          show: yAxis.show,
          type: 'value',
          axisLabel: {
            ...xAxis.textStyle,
            margin: yAxis.label.margin,
          },
          name: yAxis.label.unit,
          min: yAxis.label.min,
          max: yAxis.label.max,
          splitNumber: yAxis.label.amount,
          axisLine: {
            show: yAxis.axisLine.show,
            lineStyle: {
              color: yAxis.axisLine.color,
            },
          },
          axisTick: {
            show: yAxis.axisTick.show,
            lineStyle: {
              color: yAxis.axisTick.color,
            },
            alignWithLabel: true,
          },
          splitLine: {
            show: false,
          },
        },
        series: getSeries(),
      }
      return opts
    })

    return {
      wrapperStyle,
      option,
    }
  },
})
</script>
