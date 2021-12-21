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
<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GTooltipPopover',
  props: {
    trigger: {
      type: String,
      default: 'hover',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    delay: {
      type: Number,
      default: 500,
    },
    content: String,
  },
})
</script>
