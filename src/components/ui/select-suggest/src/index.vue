<template>
  <div
    class="datav-gui g-select-suggest"
    :class="[
      `--${size}`,
      {
        '--inline': !!inline,
        '--single': inline === 'inline-single',
        '--disabled': disabled,
      }
    ]"
  >
    <el-autocomplete
      :model-value="modelValue"
      :fetch-suggestions="querySearch"
      :size="size"
      style="width: 100%;"
      @update:model-value="handleInput"
    />
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GSelectSuggest',
  props: {
    modelValue: {
      type: [String, Number],
      default: 0,
    },
    data: Array as PropType<(number | string)[]>,
    label: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'mini',
    },
    inline: {
      type: [Boolean, String],
      default: false,
    },
    disabled: Boolean,
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup(props, ctx) {
    const handleInput = (value: string | number) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    const handleChange = (currentValue: string | number) => {
      ctx.emit('change', currentValue)
    }

    const onKeyEnter = (e: any) => {
      console.log(e)
    }

    const querySearch = (qs: string, cb: Function) => {
      const results = props.data.map(value => ({ value }))
      cb(results)
    }

    return {
      handleInput,
      handleChange,
      onKeyEnter,
      querySearch,
    }
  },
})
</script>
