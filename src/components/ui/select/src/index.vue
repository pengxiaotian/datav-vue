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

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GSelect',
  props: {
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
      type: String,
      default: 'small',
    },
    inline: {
      type: [Boolean, String],
      default: false,
    },
    disabled: Boolean,
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const handleInput = (value: string | number) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    const opts = ref(props.data.map(m => ({ label: m.value, value: m.id })))

    return {
      opts,
      handleInput,
    }
  },
})
</script>
