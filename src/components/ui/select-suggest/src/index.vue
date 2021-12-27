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
      @update:value="handleInput"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRefs, computed } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

interface DataDto {
  id: string | number
  value: string | number
}

export default defineComponent({
  name: 'GSelectSuggest',
  props: {
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
      type: String,
      default: 'small',
    },
    inline: {
      type: [Boolean, String],
      default: false,
    },
    disabled: Boolean,
    filters: Array as PropType<(number | string)[]>,
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const handleInput = (value: string | number) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
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

    // const opts = ref(list.map(m => ({ label: m.value, value: m.id })))

    const opts = computed(() => {
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
      return list.map(m => ({ label: m.value, value: m.id }))
    })

    return {
      opts,
      handleInput,
    }
  },
})
</script>
