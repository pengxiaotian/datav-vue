<template>
  <div
    class="datav-gui g-select-suggest"
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
      filterable
      tag
      :options="opts"
      :size="size"
      :disabled="disabled"
      label-field="value"
      value-field="id"
      @update:value="handleInput"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts' setup>
import { PropType, toRefs, computed } from 'vue'
import { NSelect } from 'naive-ui'
import type { Size } from 'naive-ui/es/select/src/interface'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

interface DataDto {
  id: string | number
  value: string | number
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 0,
  },
  data: {
    type: Array as PropType<DataDto[]>,
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
  filters: Array as PropType<(number | string)[]>,
})

const emits = defineEmits([UPDATE_MODEL_EVENT])

const handleInput = (value: string | number) => {
  emits(UPDATE_MODEL_EVENT, value)
}

const { data, filters } = toRefs(props)
let list: DataDto[] = []
if (filters.value && filters.value.length > 0) {
  filters.value.forEach(m => {
    const dto = data.value.find(n => n.id === m)
    if (dto) {
      list.push(dto)
    } else {
      list.push({ id: m, value: m })
    }
  })
}

const opts = computed<any[]>(() => {
  const { data, filters } = props
  let list: DataDto[] = []
  if (filters && filters.length > 0) {
    filters.forEach(m => {
      const dto = data.find(n => n.id === m)
      if (dto) {
        list.push(dto)
      } else {
        list.push({ id: m, value: m })
      }
    })
  }
  return list
})
</script>
