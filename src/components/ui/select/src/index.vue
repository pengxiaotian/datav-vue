<template>
  <div
    class="datav-gui g-select"
    :class="[
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
        '--disabled': disabled,
      }
    ]"
  >
    <n-select
      :value="modelValue"
      :options="opts"
      :size="size"
      :disabled="disabled"
      @update:value="handleInput"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { PropType, ref } from 'vue'
import { NSelect } from 'naive-ui'
import type { Size } from 'naive-ui/es/select/src/interface'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 0,
  },
  data: {
    type: Array as PropType<{ id: string | number; value: string | number; }[]>,
    default: () => [],
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
  disabled: Boolean,
})
const emits = defineEmits([UPDATE_MODEL_EVENT])

const handleInput = (value: string | number) => {
  emits(UPDATE_MODEL_EVENT, value)
}

const opts = ref<any[]>(props.data.map(m => ({ label: m.value, value: m.id })))
</script>
