<template>
  <div
    class="datav-gui g-color-picker"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
      }
    ]"
  >
    <div class="g-color-picker__inner">
      <n-input
        :value="modelValue"
        :size="size"
        @update:value="handleInput"
      />
      <n-color-picker
        :value="modelValue"
        :size="size"
        show-alpha
        :style="{
          width: 'var(--n-height)',
          flex: `0 0 var(--n-height)`
        }"
        @update:value="handleInput"
      />
    </div>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { PropType } from 'vue'
import { NInput, NColorPicker } from 'naive-ui'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

defineProps({
  modelValue: String,
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small',
  },
  label: {
    type: String,
    default: '',
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
})

const emits = defineEmits([UPDATE_MODEL_EVENT])

const handleInput = (value: string) => {
  emits(UPDATE_MODEL_EVENT, value)
}
</script>
