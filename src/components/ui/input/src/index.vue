<template>
  <input
    :value="modelValue"
    autocomplete="off"
    class="g-input"
    @input="handleInput"
  >
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {

    const handleInput = (event: any) => {
      const { value } = event.target

      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    return {
      handleInput,
    }
  },
})
</script>
