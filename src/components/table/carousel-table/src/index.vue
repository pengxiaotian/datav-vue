<template>
  <div class="datav-wraper" :style="wraperStyle">
    <div
      v-if="config.header.show"
      class="line header"
      :style="headerStyle"
    >
      <div class="index-list" :style="headerIndexStyle"></div>
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
    <div ref="rowsRef" class="rows-container" :style="rowBoxStyle">
      <div
        v-for="item in viewListData"
        :key="item.$$datav_index"
        class="line row-content"
        :style="[rowStyle, rowStripedStyle(item.$$datav_index)]"
        @click="doLink(item)"
      >
        <div
          v-if="config.idList.show"
          class="index"
          :style="indexStyle"
        >
          <div class="index-bg" :style="indexBGStyle">
            {{ item.$$datav_index }}
          </div>
        </div>
        <carousel-table-item
          v-for="(s, j) in config.series"
          :key="item.$$datav_key + j"
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
import { computed, toRef, ref, watch, CSSProperties, onUnmounted } from 'vue'
import { useDataCenter } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { CarouselTable } from './carousel-table'
import CarouselTableItem from './components/carousel-table-item.vue'

const props = defineProps<{
  com: CarouselTable
}>()

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const apiStore = useApiStore()
useDataCenter(props.com)

const config = toRef(props.com, 'config')
const attr = toRef(props.com, 'attr')

const dv_data = computed(() => {
  return apiStore.dataMap[props.com.id]?.source ?? []
})

const loopTimer1 = ref(-1)
const loopTimer2 = ref(-1)
const pageIndex = ref(0)
const viewListData = ref([])
const rowsRef = ref(null)

const headerHeight = computed(() => {
  return config.value.header.heightPercent * attr.value.h / 100
})

const rowHeight = computed(() => {
  return (attr.value.h - headerHeight.value) / config.value.global.rowCount
})

const pageCount = computed(() => {
  return Array.isArray(dv_data.value)
    ? Math.ceil(dv_data.value.length / config.value.global.rowCount)
    : 0
})

const cols = computed(() => {
  return config.value.series.map(m => m.columnName)
})

const getDataList = () => {
  const data = dv_data.value as any[]
  if (!data || !Array.isArray(data)) {
    return []
  }

  const tableData = []
  const len = cols.value.length
  data.forEach((item, index) => {
    const map = {
      $$datav_key: getRandomInt(999999) + index,
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

  const attachArr = []
  const total = dataList.length
  let diff = pageCount.value * global.rowCount - total
  if (diff > 0) {
    const len = cols.value.length
    for (let i = 0; i < diff; i++) {
      let map = {
        $$datav_key: getRandomInt(999999) + i,
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
    transition: 'none 0s ease 0s',
  }
})

const rowStripedStyle = (rowNum: number) => {
  return {
    backgroundColor: rowNum & 1
      ? config.value.row.oddBGColor
      : config.value.row.evenBGColor,
  }
}

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
    'background-color': idList.bgColor,
    'font-family': idList.textStyle.fontFamily,
    'font-weight': idList.textStyle.fontWeight,
    'line-height': `${h}px`,
    'border-radius': `${h / 2}px`,
    width: `${h}px`,
    height: `${h}px`,
  } as CSSProperties
})

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
      if (page === pageCount.value && !ifRowHidden) {
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

  if (isLoop && !(animation.singleStop && pageCount.value <= 1)) {
    goScrolling()
  } else {
    stopLoop()
  }
}

const goScrolling = () => {
  const { global } = config.value
  loopTimer1.value = window.setTimeout(() => {
    let pc = 0
    let len = 0
    let nodes = rowsRef.value.children
    if (global.animation.mode === 'top') {
      pc = pageCount.value
      len = nodes.length > global.rowCount
        ? global.rowCount
        : nodes.length
    } else {
      pc = listData.value.length
      len = 1
    }

    let nodes2 = []
    for (let i = 0; i < len; i++) {
      let node = nodes[i] as HTMLDivElement
      node.style.transition = 'height 400ms linear 0s'
      node.style.height = '0'
      nodes2.push(node)
    }

    loopTimer2.value = window.setTimeout(() => {
      for (let i = 0; i < nodes2.length; i++) {
        let node = nodes2[i]
        node.style.transition = 'none 0s ease 0s'
        node.style.height = `${rowHeight.value}px`
      }

      if (pageIndex.value === pc) {
        pageIndex.value = 1
      } else {
        pageIndex.value += 1
      }

      pageTurning()
    }, 400)
  }, global.animation.duration * 1000)
}

const doLink = (data: any) => {
  console.log(data)
}

const stopLoop = () => {
  clearTimeout(loopTimer1.value)
  clearTimeout(loopTimer2.value)
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

onUnmounted(() => {
  stopLoop()
})
</script>
