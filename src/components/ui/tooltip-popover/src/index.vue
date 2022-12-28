<template>
  <n-config-provider
    :theme-overrides="{
      Popover: {
        padding: '6px 10px',
        fontSize: '12px',
        borderRadius: '0',
        color: 'var(--datav-pop-bg-color)',
        textColor: '#fff',
        boxShadow: '#000',
      },
    }"
    abstract
  >
    <n-popover
      :placement="placement"
      :trigger="trigger"
      :delay="delay"
      :show-arrow="false"
      class="g-tooltip-popover"
    >
      <template #trigger>
        <slot></slot>
      </template>
      {{ content }}
    </n-popover>
  </n-config-provider>
</template>
<script lang='ts' setup>
import { PropType } from 'vue'
import { NConfigProvider, NPopover } from 'naive-ui'
import type { PopoverTrigger } from 'naive-ui/es/popover/src/interface'

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end'

defineProps({
  trigger: {
    type: String as PropType<PopoverTrigger>,
    default: 'hover',
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom',
  },
  delay: {
    type: Number,
    default: 500,
  },
  content: String,
})
</script>
