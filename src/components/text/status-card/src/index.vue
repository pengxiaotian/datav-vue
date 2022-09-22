<template>
  <div
    class="datav-wrapper"
    :style="wrapStyle"
  >
    <!-- 自由布局 start -->
    <template v-if="!globalConfig.manualArrangement">
      <div
        v-for="item in dv_data"
        :key="'value' in item ? item.value : item.toString()"
        class="whitespace-nowrap flex items-center"
        :style="itemWrapStyle"
      >
        <span
          :style="{...pointStyle, backgroundColor: getPointColor(item)}"
          class="w-3 h-3 inline-block rounded-[50%] bg-[#fff]"
        >
        </span>
        <span :style="textStyle">
          {{ 'name' in item ? item.name : item?.[0] }}
        </span>
      </div>
    </template>
    <!-- 自由布局 end -->

    <!-- 手动布局 start -->
    <div
      v-else
      class="flex"
      :style="{flexDirection: globalConfig.layout === 'row' ? 'column' : 'row'}"
    >
      <div
        v-for="(array, index) in dv_data_layout"
        :key="index"
        class="flex"
        :style="{flexDirection: globalConfig.layout === 'row' ? 'row' : 'column'}"
      >
        <div
          v-for="item in array"
          :key="'value' in item ? item.value : item.toString()"
          class="whitespace-nowrap flex items-center"
          :style="itemWrapStyle"
        >
          <span
            :style="{...pointStyle, backgroundColor: getPointColor(item)}"
            class="w-3 h-3 inline-block rounded-[50%] bg-[#fff]"
          >
          </span>
          <span :style="textStyle">
            {{ 'name' in item ? item.name : item?.[0] }}
          </span>
        </div>
      </div>
    </div>
    <!-- 手动布局 start -->
  </div>
</template>

<script lang='ts' setup>
import { computed, toRef, watch, defineProps } from 'vue'
import type { CSSProperties } from 'vue'
import { useDataCenter } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import type { StatusCard, Data } from './status-card'

type Props = {
  com: StatusCard
}
const props = defineProps<Props>()

const apiStore = useApiStore()
useDataCenter(props.com)

const pointStyleConfig = toRef(props.com.config, 'pointStyle')
const textStyleConfig = toRef(props.com.config, 'textStyle')
const globalConfig = toRef(props.com.config, 'global')
const statusArray = toRef(props.com.config, 'statusArray')

const wrapStyle = computed(() => {
  return {
    display: 'flex',
  }
})
const itemWrapStyle = computed(() => {
  return {
    marginBottom: `${props.com.config.spacing.vertical}px`,
    marginRight: `${props.com.config.spacing.horizontal}px`,
    flexDirection: pointStyleConfig.value.position === 'left' ? 'row' : 'row-reverse' as CSSProperties['flexDirection'],
  }
})
const pointStyle = computed(() => {
  return {
    width: `${pointStyleConfig.value.width}px`,
    height: `${pointStyleConfig.value.height}px`,
    borderRadius: `${pointStyleConfig.value.borderRadius}%`,
    marginRight: `${pointStyleConfig.value.spacing}px`,
  }
})
const textStyle = computed(() => {
  return {
    color: textStyleConfig.value.color,
    fontSize: `${textStyleConfig.value.fontSize}px`,
    fontWeight: textStyleConfig.value.fontWeight,
    fontFamily: textStyleConfig.value.fontFamily,
  }
})

/** 获取圆点颜色 */
const getPointColor = (item: Data[number]) => {
  let color = ''
  try {
    if ('value' in item) {
      color = statusArray.value?.find(v => v.value === item.value)?.color
    } else {
      color = statusArray.value?.find(v => v.value === item?.[1])?.color
    }
  } catch (err) {
    console.error(err)
  }
  return color
}

const dv_data = computed<Data>(() => {
  return apiStore.dataMap[props.com.id]?.source ?? []
})

// 如果不是自由布局，数据需要转换
const dv_data_layout = computed(() => {
  const res: Data[number][][] = []
  if (!globalConfig.value.manualArrangement) {
    return []
  }
  const dataSource = [...(apiStore.dataMap[props.com.id]?.source as Data ?? [])]
  const num = globalConfig.value.layout === 'row' ? globalConfig.value.rowNum : globalConfig.value.colNum

  while(dataSource.length) {
    res.push(dataSource.splice(0, num))
  }

  return res
})

</script>

<script lang="ts">
export default {
  name: 'VStatusCard',
}
</script>
