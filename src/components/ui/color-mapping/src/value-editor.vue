<template>
  <div class="--value-editor">
    <div class="--color-dot g-color-mapping__color-block">
      <span class="--block" :style="`background: ${color}`"></span>
    </div>
    <n-tooltip :disabled="!tooltip">
      <template #trigger>
        <new-input
          v-if="type === 'string'"
          :model-value="value"
          :disabled="readonly"
          spellcheck="false"
          placeholder="输入字段值"
          class="--value-input"
          @change="onUpdateData"
        />
        <g-input-number
          v-else
          :model-value="value"
          size="tiny"
          :readonly="readonly"
          suffix="*"
          placeholder="输入字段值"
          :input-theme="{
            color: 'var(--datav-gui-bgcolor-back)',
            colorFocus: 'var(--datav-gui-bgcolor-back)',
            suffixTextColor: 'var(--datav-gui-error-color)',
          }"
          @update:value="onUpdateData"
        />
      </template>
      {{ tooltip }}
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { NTooltip } from 'naive-ui'
import GInputNumber from '@/components/ui/input-number'
import NewInput from '@/components/ui/input/src/new-input.vue'

defineProps<{
  type: string
  value: any
  color: string
  readonly?: boolean
  tooltip?: string
  suffix?: string
}>()

const emits = defineEmits(['update-data'])

const onUpdateData = (val: string | number) => {
  emits('update-data', val)
}
</script>
