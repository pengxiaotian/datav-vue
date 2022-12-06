<template>
  <div
    :style="{
      'pointer-events': 'none',
      'z-index': 0,
      left: com.attr.x + 'px',
      top: com.attr.y + 'px',
      width: com.attr.w + 'px',
      height: com.attr.h + 'px',
      opacity: com.attr.opacity,
      transform: `rotate(${com.attr.deg}deg) ${com.attr.filpH ? 'scaleX(-1)' : ''} ${com.attr.filpV ? 'scaleY(-1)' : ''}`,
      filter: styleFilter,
    }"
    class="-datav-com absolute"
  >
    <component
      :is="com.name"
      :com="com"
      :style="{
        'pointer-events': 'auto',
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'
import { DatavComponent } from '@/components/_models/datav-component'
import { useEditorStore } from '@/store/editor'

defineProps({
  com: {
    type: Object as PropType<DatavComponent>,
    required: true,
  },
})

const editorStore = useEditorStore()
const styleFilter = computed(() => {
  const sf = editorStore.pageConfig.styleFilterParams
  let filter = ''
  if (sf.enable) {
    filter = `hue-rotate(${sf.hue}deg) contrast(${sf.contrast}%) opacity(${sf.opacity}%) saturate(${sf.saturate}%) brightness(${sf.brightness}%)`
  }
  return filter
})
</script>
