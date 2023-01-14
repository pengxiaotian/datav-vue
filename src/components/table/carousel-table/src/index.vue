<template>
  <div class="datav-wraper" :style="wraperStyle">
    <div
      v-if="config.header.show"
      class="line header"
      :style="headerStyle"
    >
      <div
        v-if="config.idList.show"
        class="index-list"
        :style="headerIndexStyle"
      ></div>
      <div
        v-for="(head, index) in config.series"
        :key="index"
        class="column column-title"
        :style="[headerTitleStyle, { width: `${head.width}%` }]"
      >
        {{ head.displayName }}
      </div>
    </div>
    <div class="placeholder" :style="`height: ${headerHeight}px`"></div>
    <div class="rows-container" :style="rowBoxStyle">
      <div
        v-for="item in viewListData"
        :key="item.$$datav_index"
        class="line row-content"
        :style="[
          rowStyle,
          rowHighLightStyle(item.$$datav_index)
        ]"
        @click="handleRowClick(item)"
      >
        <div
          v-if="config.idList.show"
          class="index"
          :style="indexStyle"
        >
          <div
            class="index-bg"
            :style="[
              indexBGStyle,
              indexBGHighLightStyle(item.$$datav_index)
            ]"
          >
            {{ item.$$datav_index }}
          </div>
        </div>
        <carousel-table-item
          v-for="(s, j) in config.series"
          :key="item.$$datav_index + j"
          :table-width="attr.w"
          :global-config="config.global"
          :config="s"
          :data="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, toRef, ref, shallowRef, watch, CSSProperties, provide, onUnmounted } from 'vue'
import gsap from 'gsap'
import { useDataCenter } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { useEventStore } from '@/store/event'
import { CarouselTable, CarouselTableEvent } from './carousel-table'
import { CarouselTableDto, carouselTableInjectionKey } from './context'
import CarouselTableItem from './components/carousel-table-item.vue'

const props = defineProps<{
  com: CarouselTable
}>()

const apiStore = useApiStore()
const eventStore = useEventStore()
useDataCenter(props.com)

const config = toRef(props.com, 'config')
const attr = toRef(props.com, 'attr')

const dv_data = computed(() => {
  return apiStore.dataMap[props.com.id]?.source ?? []
})

const timeId = ref(-1)
const tween = shallowRef<gsap.core.Tween>(null)
const pageIndex = ref(0)
const viewListData = ref<CarouselTableDto[]>([])
const curHighLightId = ref(1)
const transform = ref(0)

const headerHeight = computed(() => {
  return config.value.header.heightPercent * attr.value.h / 100
})

const rowHeight = computed(() => {
  return (attr.value.h - headerHeight.value) / config.value.global.rowCount
})

const pageTotal = computed(() => {
  return Array.isArray(dv_data.value)
    ? Math.ceil(dv_data.value.length / config.value.global.rowCount)
    : 0
})

const cols = computed(() => {
  return config.value.series.map(m => m.columnName)
})

const hlRowNums = computed(() => {
  return config.value.global.highLight.hlIndex.split(',').map(m => +m)
})

const getDataList = () => {
  const data = dv_data.value as any[]
  if (!data || !Array.isArray(data)) {
    return []
  }

  const tableData: CarouselTableDto[] = []
  const len = cols.value.length
  data.forEach((item, index) => {
    const map = {
      $$datav_index: index + 1,
    }
    for (let i = 0; i < len; i++) {
      const field = cols.value[i]
      map[field] = item[field] ?? null
    }
    tableData.push(map)
  })
  return tableData
}

const listData = computed(() => {
  const { global } = config.value
  const dataList = getDataList()
  if (global.ifRowHidden) {
    return dataList
  }

  const attachArr: CarouselTableDto[] = []
  const total = dataList.length
  let diff = pageTotal.value * global.rowCount - total
  if (diff > 0) {
    const len = cols.value.length
    for (let i = 0; i < diff; i++) {
      let map = {
        $$datav_index: total + i + 1,
      }
      for (let j = 0; j < len; j++) {
        map[cols.value[j]] = '-'
      }
      attachArr.push(map)
    }
  }
  return [...dataList, ...attachArr]
})

const wraperStyle = computed(() => {
  const { global } = config.value
  return {
    opacity: 1,
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    fontFamily: global.fontFamily,
    width: `${attr.value.w}px`,
    height: `${attr.value.h}px`,
  }
})

const headerStyle = computed(() => {
  const { header } = config.value
  return {
    'z-index': 2,
    width: '100%',
    position: 'absolute',
    display: 'flex',
    'align-items': 'center',
    'vertical-align': 'middle',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
    overflow: 'hidden',
    height: `${headerHeight.value}px`,
    fontFamily: header.textStyle.fontFamily,
    color: header.textStyle.color,
    backgroundColor: header.bgColor,
  } as CSSProperties
})

const headerIndexStyle = computed(() => {
  return {
    display: 'inline-block',
    'vertical-align': 'middle',
    width: `${config.value.idList.width}%`,
    height: `${headerHeight.value}px`,
  }
})

const headerTitleStyle = computed(() => {
  const { textStyle } = config.value.header
  return {
    display: 'inline-block',
    overflow: 'hidden',
    'white-space': 'nowrap',
    'vertical-align': 'middle',
    'background-color': 'transparent',
    'text-align': textStyle.textAlign,
    'font-size': `${textStyle.fontSize}px`,
    'font-weight': textStyle.fontWeight,
    color: textStyle.color,
  } as CSSProperties
})

const rowBoxStyle = computed(() => {
  return {
    width: '100%',
    height: `${attr.value.h - headerHeight.value}px`,
    overflow: 'hidden',
  }
})

const rowStyle = computed(() => {
  return {
    display: 'flex',
    'align-items': 'center',
    'vertical-align': 'middle',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    height: `${rowHeight.value}px`,
    opacity: 1,
    transform: `translateY(-${transform.value}px)`,
  }
})

const indexStyle = computed(() => {
  const { idList } = config.value
  return {
    display: 'inline-block',
    'text-align': 'center',
    'vertical-align': 'middle',
    width: `${idList.width}%`,
    color: idList.textStyle.color,
    fontSize: `${idList.textStyle.fontSize}px`,
  } as CSSProperties
})

const indexBGStyle = computed(() => {
  const { idList } = config.value
  const h = rowHeight.value * idList.radius / 100 - 4
  return {
    margin: 'auto',
    'vertical-align': 'middle',
    'text-align': 'center',
    'font-family': idList.textStyle.fontFamily,
    'font-weight': idList.textStyle.fontWeight,
    'line-height': `${h}px`,
    'border-radius': `${h / 2}px`,
    width: `${h}px`,
    height: `${h}px`,
  } as CSSProperties
})

const isHighLight = (rowId: number) => {
  const { show, isOrder } = config.value.global.highLight
  return show && ((isOrder && curHighLightId.value === rowId)
      || (!isOrder && hlRowNums.value.includes(rowId)))
}

const rowHighLightStyle = (rowId: number) => {
  const { bgColor, border } = config.value.global.highLight.hlStyle
  if (isHighLight(rowId)) {
    return {
      backgroundColor: bgColor,
      border: `${border.width}px ${border.style} ${border.color}`,
    }
  }

  return {
    backgroundColor: rowId & 1
      ? config.value.row.oddBGColor
      : config.value.row.evenBGColor,
  }
}

const indexBGHighLightStyle = (rowId: number) => {
  const { textStyle } = config.value.global.highLight.hlStyle
  if (isHighLight(rowId)) {
    return  {
      'background-image': 'none',
      'background-position': 'initial',
      'background-size': 'initial',
      'background-repeat': 'initial',
      'background-attachment': 'initial',
      'background-origin': 'initial',
      'background-clip': 'unset',
      '-webkit-text-fill-color': 'initial',
      'font-size': textStyle.fontSize,
      color: textStyle.color,
    }
  }

  return {
    'background-color': config.value.idList.bgColor,
  }
}

const pageTurning = () => {
  const page = pageIndex.value
  const { animation, rowCount, isLoop, ifRowHidden } = config.value.global
  if (page === 0) {
    viewListData.value = listData.value
  } else {
    let v1 = 0, v2 = 0
    let v3 = 0, v4 = 0
    if (animation.mode === 'top') {
      v1 = (page - 1) * rowCount
      v2 = page * rowCount + 1
      if (page === pageTotal.value && !ifRowHidden) {
        v3 = 1
        v4 = rowCount
      } else {
        v3 = v2
        v4 = (page + 1) * rowCount
      }
    } else {
      v1 = page - 1
      v2 = page + rowCount
      const totalCount = listData.value.length
      const diff = page - totalCount + rowCount
      if (diff > 0 && totalCount > rowCount) {
        v3 = 1
        v4 = diff
      } else {
        v3 = v2
        v4 = v2 + 1
      }
    }

    viewListData.value = [
      ...listData.value.filter(m => v1 < m.$$datav_index && m.$$datav_index < v2),
      ...listData.value.filter(m => v3 <= m.$$datav_index && m.$$datav_index <= v4),
    ]
  }

  if (isLoop && !(animation.singleStop && pageTotal.value <= 1)) {
    goScrolling()
  } else {
    stopLoop()
  }
}

const goScrolling = () => {
  const { global } = config.value
  const { show, isOrder } = global.highLight
  timeId.value = window.setTimeout(() => {
    if (show && isOrder) {
      const id = curHighLightId.value + 1
      const hasVal = viewListData.value.some(m => m.$$datav_index === id)
      if (hasVal) {
        curHighLightId.value = id
      } else {
        curHighLightId.value = 1
      }

      if (global.animation.mode === 'top') {
        if (hasVal && id <= pageIndex.value * global.rowCount) {
          goScrolling()
          return
        }
      }
    }

    let total = listData.value.length
    let scroll = rowHeight.value
    if (global.animation.mode === 'top') {
      total = pageTotal.value
      scroll *= global.rowCount
    }

    tween.value = gsap.fromTo(transform, {
      value: 0,
    }, {
      duration: 0.85,
      value: scroll,
      onComplete: () => {
        transform.value = 0
        if (pageIndex.value === total) {
          pageIndex.value = 1
          handleScrollEnd(viewListData.value[0])
        } else {
          pageIndex.value += 1
        }
        pageTurning()
      },
    })

    handleDataFlipped(viewListData.value[0])
    handleDataHighLight(curHighLightId.value)
  }, global.animation.duration * 1000)
}

const stopLoop = () => {
  clearTimeout(timeId.value)
  tween.value?.kill()
  transform.value = 0
  curHighLightId.value = 1
}

const reset = () => {
  pageIndex.value = 1
  stopLoop()
  pageTurning()
}

watch(() => config.value.global, () => {
  reset()
}, {
  deep: true,
})

watch(listData, () => {
  reset()
})

const getEmitData = (item: CarouselTableDto) => {
  return item ? { ...item, index: item.$$datav_index } : {}
}

const handleRowClick = (data: CarouselTableDto) => {
  eventStore.handleSubVariablesChange(
    props.com.id,
    CarouselTableEvent.rowClicked,
    getEmitData(data),
  )
}

const handleDataFlipped = (data: CarouselTableDto) => {
  eventStore.handleSubVariablesChange(
    props.com.id,
    CarouselTableEvent.dataFlipped,
    getEmitData(data),
  )
}

const handleDataHighLight = (rowId: number) => {
  if (isHighLight(rowId)) {
    const data = viewListData.value.find(m => m.$$datav_index === rowId)
    eventStore.handleSubVariablesChange(
      props.com.id,
      CarouselTableEvent.dataHighLight,
      getEmitData(data),
    )
  }
}

const handleScrollEnd = (data: CarouselTableDto) => {
  eventStore.handleSubVariablesChange(
    props.com.id,
    CarouselTableEvent.scrollEnd,
    {
      isEnding: true,
      ...getEmitData(data),
    },
  )
}

provide(carouselTableInjectionKey, {
  isHighLight,
})

onUnmounted(() => {
  stopLoop()
})
</script>
