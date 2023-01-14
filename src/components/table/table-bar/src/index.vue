<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <div
      v-for="(item, index) in partListData"
      :key="item.$$datav_index"
      style="position: relative; perspective: 250px; perspective-origin: 50% 100%;"
      class="table-line"
    >
      <table-bar-item
        :config="config"
        :data="item"
        :index="index"
        :table-width="attr.w"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, toRef, provide, markRaw, watch, onUnmounted } from 'vue'
import { orderBy, maxBy, debounce } from 'lodash-es'
import { useDataCenter, getFieldMap } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { TableBar } from './table-bar'
import { tableBarInjectionKey } from './context'
import TableBarItem from './components/table-bar-item.vue'

const props = defineProps<{
  com: TableBar
}>()

const apiStore = useApiStore()
useDataCenter(props.com)

const config = toRef(props.com, 'config')
const attr = toRef(props.com, 'attr')
const pageIndex = ref(1)
const flipTimerId = ref(null)
const watchFlag = ref(0)

const dv_data = computed<any[]>(() => {
  return apiStore.dataMap[props.com.id]?.source ?? []
})

const dv_field = computed(() => {
  return getFieldMap(props.com.apis.source.fields)
})

const wraperStyle = computed(() => {
  return {
    transform: 'translate3d(0px, 0px, 0px)',
    width: `${attr.value.w}px`,
    height: `${attr.value.h}px`,
    opacity: attr.value.opacity,
    fontFamily: `${config.value.global.fontFamily}, Arial, sans-serif`,
  }
})

const listData = computed(() => {
  const list = dv_data.value.map((m, index) => {
    const value = +m[dv_field.value.value]
    return {
      $$datav_index: index,
      value: isNaN(value) ? 0 : value,
      content: m[dv_field.value.content] ?? '',
      dataRef: markRaw(m),
    }
  })

  const { show, sort } = config.value.global.sort
  return show
    ? orderBy(list, o => o.value, sort as any)
    : list
})

const partListData = computed(() => {
  const { quantity } = config.value.global
  const start = quantity * (pageIndex.value - 1)
  return listData.value.slice(start, start + quantity)
})

const maxNum = computed(() => {
  const len = listData.value.length
  if (len === 0) {
    return 0
  }

  const { show, sort } = config.value.global.sort
  return show
    ? listData.value[sort === 'desc' ? 0 : len - 1].value
    : maxBy(listData.value, m => m.value).value
})

const flipOver = () => {
  if (!config.value.global.loop) {
    return
  }

  const { quantity, looptime } = config.value.global
  flipTimerId.value = window.setTimeout(() => {
    const pageTotal = Math.ceil(listData.value.length / quantity)
    pageIndex.value = pageTotal <= pageIndex.value ? 1 : pageIndex.value + 1
    flipOver()
  }, looptime)
}

watch([config, attr, pageIndex], debounce(() => {
  watchFlag.value = Math.random()
}, 300), {
  deep: true,
  immediate: true,
})

watch(() => config.value.global.loop, loop => {
  clearTimeout(flipTimerId.value)
  if (loop) {
    flipOver()
  } else {
    pageIndex.value = 1
  }
}, {
  immediate: true,
})

onUnmounted(() => {
  clearTimeout(flipTimerId.value)
})

provide(tableBarInjectionKey, {
  pageIndex,
  maxNum,
  watchFlag,
})
</script>
