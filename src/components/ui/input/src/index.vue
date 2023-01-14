<template>
  <div
    class="datav-gui g-input"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
      }
    ]"
  >
    <n-input
      :value="modelValue"
      :size="size"
      placeholder=""
      @update:value="handleInput"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { PropType } from 'vue'
import { NInput } from 'naive-ui'
import type { Size } from 'naive-ui/es/input/src/interface'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

defineProps({
  modelValue: {
    type: [String],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<Size>,
    default: 'small',
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
})
const emits = defineEmits([UPDATE_MODEL_EVENT])

const handleInput = (value: string | number) => {
  emits(UPDATE_MODEL_EVENT, value)
}
</script>
