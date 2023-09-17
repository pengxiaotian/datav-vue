<template>
  <div
    class="datav-gui g-switch"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
        '--disabled': disabled,
      }
    ]"
  >
    <div class="g-switch-inner">
      <n-switch
        :value="modelValue"
        :size="size"
        :disabled="disabled"
        @update:value="handleInput"
      />
    </div>
    <template v-if="tooltip && label">
      <n-tooltip placement="top">
        <template #trigger>
          <span class="g-input__caption-with-description">
            {{ label }}
          </span>
        </template>
        {{ tooltip }}
      </n-tooltip>
    </template>
    <span v-else-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import { NSwitch, NTooltip } from 'naive-ui'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<'medium' | 'small' | 'large'>,
    default: 'medium',
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
  disabled: Boolean,
  tooltip: String,
})

const emits = defineEmits([UPDATE_MODEL_EVENT])

const handleInput = (value: boolean) => {
  emits(UPDATE_MODEL_EVENT, value)
}
</script>
