<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { ComponentAttr } from '@/components/_models/datav-component'

const props = defineProps({
  attr: {
    type: Object as PropType<ComponentAttr>,
    required: true,
  },
})

const wrapperStyle = computed(() => {
  return {
    transform: 'translateZ(0)',
    width: `${props.attr.w}px`,
    height: `${props.attr.h}px`,
  }
})
</script>
