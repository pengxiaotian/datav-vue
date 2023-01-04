<template>
  <div class="column cell-content" :style="textTypeStyle">
    <div class="marquee-text">
      <span style="display: inline-block;" class="marquee-text-span">
        <template v-if="data[config.columnName] == null">
          {{ '-' }}
        </template>
        <template v-else-if="config.dataType === 'text'">
          {{ data[config.columnName] }}
        </template>
        <img
          v-else-if="config.dataType === 'img'"
          key="img"
          class="marquee-img"
          :src="showError ? (globalConfig.defaultImg || defaultImg) : data[config.columnName]"
          :style="imgTypeStyle"
          @error="onError"
        >
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, CSSProperties, watchEffect } from 'vue'
import { CarouselTable, CarouselTableSeries, defaultImg } from '../carousel-table'

const props = defineProps<{
  data: any
  globalConfig: CarouselTable['config']['global']
  config: CarouselTableSeries
}>()

const showError = ref(false)

const textTypeStyle = computed(() => {
  const { width, textAlign, textStyle, isBr } = props.config
  let style = {
    display: 'inline-block',
    'vertical-align': 'middle',
    'background-color': 'transparent',
    'text-align': textAlign,
    overflow: 'hidden',
    width: `${width}%`,
    color: textStyle.color,
    fontFamily: textStyle.fontFamily,
    'font-size': `${textStyle.fontSize}px`,
    'font-weight': textStyle.fontWeight,
  }
  if (isBr) {
    style['word-break'] = 'break-all'
  } else {
    style['white-space'] = 'nowrap'
  }
  return style as CSSProperties
})

const imgTypeStyle = computed(() => {
  return {
    width: `${props.config.widthPercent}px`,
    'margin-left': 0,
    'margin-top': 0,
    'font-size': 0,
  }
})

const onError = () => {
  showError.value = true
}

watchEffect(() => {
  if (props.config.dataType === 'img') {
    void props.data[props.config.columnName]
    showError.value = false
  }
})
</script>
