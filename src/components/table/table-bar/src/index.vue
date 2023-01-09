<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <div
      v-for="(item, index) in partListData"
      :key="index"
      style="position: relative; perspective: 250px; perspective-origin: 50% 100%;"
      class="table-line"
    >
      <table-bar-item
        :config="config"
        :bar="item"
        :index="index"
        :serial-num="index + (pageIndex - 1) * config.global.quantity"
        :max-value="maxNum"
        :flag="flag"
        :table-width="attr.w"
        @lastCompleted="lastCompleted"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, watch, toRef } from 'vue'
import { useDataCenter, getFieldMap } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { TableBar } from './table-bar'
import TableBarItem from './components/table-bar-item.vue'

const props = defineProps<{
  com: TableBar
}>()

const apiStore = useApiStore()
useDataCenter(props.com)

const config = toRef(props.com, 'config')
const attr = toRef(props.com, 'attr')
const flag = ref(0)
const pageIndex = ref(1)

const dv_data = computed(() => {
  return apiStore.dataMap[props.com.id]?.source ?? {}
})

const dv_field = computed(() => {
  return getFieldMap(props.com.apis.source.fields)
})

const wraperStyle = computed(() => {
  const { global } = config.value
  return {
    'font-family': `${global.fontFamily}, Arial, sans-serif`,
    width: `${attr.value.w}px`,
    height: `${attr.value.h}px`,
    transform: 'translate3d(0px, 0px, 0px)',
  }
})

const listData = computed(() => {
  return []
})

const partListData = computed(() => {
  return []
})

const maxNum = computed(() => {
  return 0
})

const lastCompleted = (index: number) => {
  if (index === partListData.value.length - 1) {
    window.setTimeout(() => {
      flag.value++
      calcPagination()
    }, config.value.global.looptime)
  }
}

const calcPagination = () => {
  pageIndex.value += 1
  let totalCount = Math.ceil(listData.value.length / config.value.global.quantity)
  if (totalCount < pageIndex.value) {
    pageIndex.value = 1
  }
}

watch(() => config.value.global.loop, () => {
  pageIndex.value = 0
})
</script>
