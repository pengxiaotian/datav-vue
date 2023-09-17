<template>
  <n-popover
    raw
    :show-arrow="false"
    trigger="click"
    placement="bottom"
    class="g-color-mapping-scheme-select-popover"
  >
    <template #trigger>
      <div class="g-color-mapping-scheme-select">
        <div class="--scheme">
          <div
            v-for="c in colors"
            :key="c"
            class="--block"
            :style="`background: ${c};`"
          ></div>
        </div>
      </div>
    </template>
    <template v-if="isPreset">
      <div class="--scheme-select-title">当前映射</div>
      <div class="--scheme-wp">
        <div class="--scheme">
          <div
            v-for="c in colors"
            :key="c"
            class="--block"
            :style="`background: ${c};`"
          ></div>
        </div>
      </div>
      <div class="--scheme-select-title">选择模板</div>
    </template>
    <div
      v-for="pc in presetColors"
      :key="pc.scheme"
      class="--scheme-wp"
      :class="value === pc.scheme ? '--selected' : ''"
      @click="selectPresetColor(pc.scheme)"
    >
      <div class="--scheme">
        <div
          v-for="c in pc.colors"
          :key="c"
          class="--block"
          :style="`background: ${c};`"
        ></div>
      </div>
    </div>
  </n-popover>
</template>

<script lang="ts" setup>
import { NPopover } from 'naive-ui'

defineProps<{
  value: string
  colors: string[]
  presetColors: any[]
  isPreset?: boolean
}>()

const emits = defineEmits(['update:value'])

const selectPresetColor = (val: string) => {
  emits('update:value', val)
}
</script>
