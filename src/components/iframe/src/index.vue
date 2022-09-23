<template>
  <div v-if="isDisplay" class="datav-wrapper h-full group">
    <iframe
      :src="iframeSrc"
      frameborder="0"
      :scrolling="config.noScrolling ? 'no' : 'auto'"
      class="w-full h-full"
      allowfullscreen
    ></iframe>
    <span
      v-if="config.closeButton"
      style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfgDBQPDy0JAJtsAAAAnElEQVRIx+2Uyw2DMBBE90IHKYEK4OIDFEEhcU2kNCp5OSSQxUQaR3uK5HfzyDu29mfWaHwBYwUgF3oG4IE0GNhZnLoc6qgMJj6kt5acNiuDjs1d783o3Xmj01m44SlOdYk8v3n6T20tEldSdXiR90tNai2yC8+/h8d+EMxBsArBPgh3opyFSRmMYhoHZbDvg3uhv7pilfug8Y88AejGcLnU1zXYAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTEyLTIwVDE1OjE1OjQ1KzA4OjAweSbnbAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0xMi0yMFQxNToxNTo0NSswODowMAh7X9AAAAAASUVORK5CYII=)"
      :class="`absolute top-0 right-0 w-7 h-7 bg-gray-500 opacity-40 cursor-pointer rounded-bl-1 bg-contain ${config.alwaysShowCloseButton ? 'inline-block' : 'display-none'} group-hover:inline-block`"
      @click.stop="toggle"
    >
    </span>
  </div>
</template>

<script lang='ts' setup>
import { computed, toRef, defineProps, ref } from 'vue'
import { useDataCenter, getFieldMap } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import type { Data, Iframe } from './iframe'

type Props = {
  com: Iframe
}

const props = defineProps<Props>()

const apiStore = useApiStore()
useDataCenter(props.com)

const dv_data = computed<Data>(() => {
  return apiStore.dataMap[props.com.id]?.source ?? {}
})

const dv_field = computed(() => {
  return getFieldMap(props.com.apis.source.fields)
})

const config = toRef(props.com, 'config')

const iframeSrc = computed(() => {
  return dv_data.value?.[0]?.url || config.value.url || 'https://www.baidu.com'
})

const isDisplay = ref(true)
function toggle() {
  isDisplay.value = !isDisplay.value
}
</script>

<script lang='ts'>
export default {
  name: 'VIframe',
}
</script>
