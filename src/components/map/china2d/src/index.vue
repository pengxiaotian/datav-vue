<template>
  <datav-wrapper :attr="com.attr">
    <v-chart
      ref="chartRef"
      autoresize
      :option="option"
      :update-options="updateOptions"
      @mousedown="handleMousedown"
      @mouseup="handleMouseup"
      @click="handleClick"
      @mouseover="handleMouseover"
      @mouseout="handleMouseout"
    />

    <div class="subcoms-box">
      <component
        :is="sc.name"
        v-for="sc in subComs"
        :key="sc.id"
        :com="sc"
      />
    </div>
  </datav-wrapper>
</template>

<script lang='ts' setup>
import { computed, toRef, ref, shallowRef, onBeforeMount, watch, nextTick } from 'vue'
import { useDataCenter, getFieldMap } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { useComStore } from '@/store/com'
import { useEventStore } from '@/store/event'
import { China2d, China2dSubType } from './china2d'
import { DatavEChartsComponent } from '@/components/_models/datav-component'
import { China2dArea } from './china2d-area/index'
import { China2dBubbles } from './china2d-bubbles/index'
import { China2dFlyingline, flareIcons } from './china2d-flyingline/index'

import VChart from 'vue-echarts'
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, TooltipComponent, GeoComponent, VisualMapComponent } from 'echarts/components'
import { MapChart, EffectScatterChart, LinesChart } from 'echarts/charts'
import { registerMapAsync } from '@/components/_utils/echarts-util'

use([
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  GeoComponent,
  VisualMapComponent,
  MapChart,
  EffectScatterChart,
  LinesChart,
])

const props = defineProps<{
  com: China2d
}>()

const apiStore = useApiStore()
const comStore = useComStore()
const eventStore = useEventStore()
useDataCenter(props.com)

const isLoadMap = ref(false)

const updateOptions = {
  replaceMerge: ['series'],
}

const chartRef = shallowRef(null)
const config = toRef(props.com, 'config')

const dv_data = computed(() => {
  return apiStore.dataMap[props.com.id]?.source ?? {}
})

const dv_field = computed(() => {
  return getFieldMap(props.com.apis.source.fields)
})

const subComs = computed<DatavEChartsComponent[]>(() => {
  return comStore.subComs.filter(c => c.parentId === props.com.id && !c.hided)
})

const chartData = computed(() => {
  const { zoom, center } = config.value.global
  const data = Array.isArray(dv_data.value) ? dv_data.value[0] : dv_data.value
  if (data) {
    return {
      zoom: data[dv_field.value.zoom] ?? zoom.value,
      lng: data[dv_field.value.lng] ?? center.lat,
      lat: data[dv_field.value.lat] ?? center.lng,
    }
  }

  return {
    zoom: zoom.value,
    lng: center.lng,
    lat: center.lat,
  }
})

const getSubComData = (comId: string) => {
  return apiStore.dataMap[comId]?.source ?? []
}

const getSubComField = (com: DatavEChartsComponent) => {
  return getFieldMap(com.apis.source.fields)
}

const getTooltipConfig = (subCom: China2dArea) => {
  const tt = subCom.config.tooltip
  if (tt.show) {
    const tooltip = tt.styleType === 'parent'
      ? config.value.tooltip
      : tt
    const fieldMap = getSubComField(subCom)
    return {
      show: true,
      trigger: 'item',
      triggerOn: tt.eventType,
      textStyle: {
        ...tooltip.textStyle,
        lineHeight: tooltip.lineHeight,
      },
      padding: [
        tooltip.padding.top,
        tooltip.padding.right,
        tooltip.padding.bottom,
        tooltip.padding.left,
      ],
      backgroundColor: tooltip.bgColor,
      borderWidth: 0,
      extraCssText: `border-radius: ${tooltip.borderRadius}px;`,
      formatter: (params: any) => {
        if (tt.infoField && params.data) {
          const txt = params.data[fieldMap.info]
          if (txt) {
            return txt
          }
        }
        const param = Array.isArray(params) ? params[0] : params
        return `名称: ${param.name}<br>数值: ${param.value}`
      },
    }
  }

  return {
    show: false,
  }
}

const getAreaStyle = (subCom: China2dArea, index: number) => {
  let data = getSubComData(subCom.id)
  const fieldMap = getSubComField(subCom)
  if (!Array.isArray(data)) {
    data = [data]
  }

  let min = 0, max = 1
  for (const item of data) {
    const val = item[fieldMap.value]
    if (min > val) {
      min = val
    } else if (max < val) {
      max = val
    }
  }

  const { fill, stroke } = subCom.config.defaultStyle
  const { labelStyle, interactive } = subCom.config
  const visualMap = {
    show: false,
    min,
    max,
    realtime: false,
    seriesIndex: index,
    inRange: {
      color: [fill.minFillColor, fill.maxFillColor],
    },
  }

  const itemStyle = {
    areaColor: fill.fillColor,
    borderType: stroke.dashArray,
    borderColor: stroke.color,
    borderWidth: stroke.weight,
  }

  const label = {
    show: labelStyle.show,
    color: labelStyle.color,
    fontFamily: labelStyle.fontFamily,
    fontSize: labelStyle.fontSize,
    textShadowColor: labelStyle.shadowColor,
    textShadowBlur: 2,
  }

  const emphasis = {
    disabled: !interactive.isHover.show,
    itemStyle: {
      areaColor: interactive.isHover.fillColor,
      borderType: 'solid',
      borderColor: interactive.isHover.strokeColor,
      borderWidth: interactive.isHover.weight,
    },
    label: {
      color: labelStyle.color,
    },
  }

  return {
    visualMap,
    itemStyle,
    label,
    emphasis,
  }
}

const getAreaSerie = (subCom: China2dArea) => {
  let data = getSubComData(subCom.id)
  const fieldMap = getSubComField(subCom)
  if (!Array.isArray(data)) {
    data = [data]
  }

  const list = []
  for (const item of data) {
    list.push({
      area_id: item[fieldMap.area_id],
      name: item[fieldMap.name],
      value: item[fieldMap.value],
      info: item[fieldMap.info],
      dataRef: item,
    })
  }

  return {
    id: subCom.id,
    type: 'map',
    zlevel: 1,
    // https://github.com/apache/echarts/issues/18005
    nameProperty: 'name', // 目前只能是 name
    data: list,
    geoIndex: 0,
    select: {
      disabled: true,
    },
  }
}

const getBubbleSerie = (subCom: China2dBubbles) => {
  let data = getSubComData(subCom.id)
  const fieldMap = getSubComField(subCom)
  if (!Array.isArray(data)) {
    data = [data]
  }

  const { defaultStyle, typeSeries } = subCom.config
  const typeMap: Record<string, typeof typeSeries[0]> = {}
  for (const ts of typeSeries) {
    typeMap[ts.bubbleType] = ts
  }

  const list = []
  for (const item of data) {
    const ts = typeMap[item[fieldMap.type]] ?? typeSeries[0]
    list.push({
      value: [
        item[fieldMap.lng],
        item[fieldMap.lat],
        item[fieldMap.value],
      ],
      symbol: ts.bubbleKey,
      itemStyle: {
        color: ts.fillColor,
      },
    })
  }

  return {
    id: subCom.id,
    type: 'effectScatter',
    coordinateSystem: 'geo',
    zlevel: 1,
    effectType: defaultStyle.effectType,
    rippleEffect: {
      number: defaultStyle.number,
      period: defaultStyle.period,
      scale: defaultStyle.offset,
      brushType: defaultStyle.brushType,
    },
    symbolSize: (val: number[]) => {
      const v = val[2]
      const [min, max] = defaultStyle.sizeRange
      return v > min ? v > max ? max : v : min
    },
    symbolSize2: defaultStyle.sizeRange, // 无实际意义，方便 vue watch
    itemStyle: {
      opacity: defaultStyle.opacity,
    },
    data: list,
  }
}

const getFlyinglineSerie = (subCom: China2dFlyingline) => {
  const { flyinglineStyle, flareStyle } = subCom.config
  if (flareStyle.lineWidth === 0) {
    return []
  }

  let data = getSubComData(subCom.id)
  const fieldMap = getSubComField(subCom)
  if (!Array.isArray(data)) {
    data = [data]
  }

  const list = []
  for (const item of data) {
    list.push({
      coords: [
        item[fieldMap.from].split(','),
        item[fieldMap.to].split(','),
      ],
    })
  }

  const flyline = {
    id: `${subCom.id}_1`,
    name: subCom.id,
    type: 'lines',
    coordinateSystem: 'geo',
    zlevel: 2,
    effect: {
      show: true,
      period: flyinglineStyle.period,
      constantSpeed: flyinglineStyle.constantSpeed,
      trailLength: flyinglineStyle.trailLength,
      symbol: 'circle',
      symbolSize: flyinglineStyle.trailSize,
    },
    lineStyle: {
      width: flyinglineStyle.lineWidth,
      opacity: flyinglineStyle.opacity,
      curveness: flyinglineStyle.curveness,
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: flyinglineStyle.fromColor },
        { offset: flyinglineStyle.k, color: flyinglineStyle.toColor  },
        { offset: 1, color: '#0000'  },
      ]),
    },
    data: list,
  }

  if (flareStyle.show) {
    return [
      flyline,
      {
        id: `${subCom.id}_2`,
        name: subCom.id,
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 3,
        effect: {
          show: true,
          period: flyinglineStyle.period,
          constantSpeed: flyinglineStyle.constantSpeed,
          trailLength: 0,
          // 修改这个不能立即生效??
          symbol: flareIcons[flareStyle.type]
            ? flareIcons[flareStyle.type]
            : flareStyle.type,
          symbolSize: flareStyle.size,
          color: flareStyle.color,
        },
        lineStyle: {
          width: flareStyle.lineWidth || 0,
          opacity: 0,
          curveness: flyinglineStyle.curveness,
        },
        data: list,
      },
    ]
  }

  return [flyline]
}

const option = computed(() => {
  if (!isLoadMap.value) {
    return {}
  }

  let tooltip = { show: false }
  let areaStyle: any = {}
  const series = []

  const { global, interactive } = config.value
  for (let i = 0, len = subComs.value.length; i < len; i++) {
    const subCom = subComs.value[i]
    if (subCom.name === China2dSubType.area) {
      tooltip = getTooltipConfig(subCom as China2dArea)
      areaStyle = getAreaStyle(subCom as China2dArea, i)
      series.push(getAreaSerie(subCom as China2dArea))
    } else if (subCom.name === China2dSubType.bubbles) {
      series.push(getBubbleSerie(subCom as China2dBubbles))
    } else if (subCom.name === China2dSubType.flyingline) {
      const arr = getFlyinglineSerie(subCom as China2dFlyingline)
      if (arr.length > 0) {
        series.push(...arr)
      }
    }
  }

  return {
    backgroundColor: global.bgColor,
    geo: {
      map: 'China',
      roam: interactive.scrollWheelZoom && interactive.dragging
        ? true : interactive.scrollWheelZoom
          ? 'scale' : interactive.dragging
            ? 'move' : false,
      silent: !interactive.isInteractive,
      scaleLimit: {
        min: global.zoom.range[0],
        max: global.zoom.range[1],
      },
      center: [chartData.value.lng, chartData.value.lat],
      zoom: chartData.value.zoom,
      itemStyle: areaStyle.itemStyle ?? {
        areaColor: '#0000',
        borderWidth: 0,
      },
      label: areaStyle.label,
      emphasis: areaStyle.emphasis,
    },
    visualMap: areaStyle.visualMap,
    tooltip,
    series,
  }
})

// 修复修改飞线的symbol后不生效bug
watch(() => {
  const list = subComs.value.filter(m => m.name === China2dSubType.flyingline)
  let str = ''
  list.forEach(item => {
    str += `${item.config.flareStyle.show}-${item.config.flareStyle.type},`
  })
  return str
}, (nVal, oVal) => {
  if (nVal && oVal) {
    const list = subComs.value.filter(m => m.name === China2dSubType.flyingline)
    list.forEach(item => {
      item.config.flareStyle.lineWidth = 0
    })

    nextTick(() => {
      list.forEach(item => {
        item.config.flareStyle.lineWidth = 1
      })
    })
  }
})

const commonProcess = (eventName: string, params: any) => {
  for (const subCom of subComs.value) {
    if (subCom.events[eventName]) {
      eventStore.handleSubVariablesChange(subCom.id, eventName,
        {
          ...(params.data ? params.data.dataRef : {}),
          name: params.name,
        })
    }
  }
}

const isMove = ref(false)
const handleMousedown = () => {
  chartRef.value.chart.on('mousemove', () => {
    chartRef.value.chart.off('mousemove')
    if (!isMove.value) {
      isMove.value = true
      const geo = chartRef.value.getOption().geo[0]
      eventStore.handleSubVariablesChange(
        props.com.id,
        'map-move',
        {
          lng: geo.center[0],
          lat: geo.center[1],
          zoom: geo.zoom,
        })
    }
  })
}

const handleMouseup = () => {
  chartRef.value.chart.off('mousemove')
  if (isMove.value) {
    isMove.value = false
    const geo = chartRef.value.getOption().geo[0]
    eventStore.handleSubVariablesChange(
      props.com.id,
      'map-moveend',
      {
        lng: geo.center[0],
        lat: geo.center[1],
        zoom: geo.zoom,
      })
  }
}

const handleClick = (params: any) => {
  commonProcess('click', params)
}

const handleMouseover = (params: any) => {
  commonProcess('mouseover', params)
}

const handleMouseout = (params: any) => {
  commonProcess('mouseout', params)
}

onBeforeMount(async () => {
  await registerMapAsync('China')
  isLoadMap.value = true
})
</script>
