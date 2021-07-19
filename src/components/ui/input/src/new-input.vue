<template>
  <input
    ref="inputRef"
    :value="modelValue"
    autocomplete="off"
    class="new-input"
    :class="{ 'is-disabled': disabled }"
    :disabled="disabled"
    :autofocus="autofocus"
    @input="handleInput"
    @blur="handleBlur"
    @keypress.enter="handleKeyEnter"
  >
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'NewInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    disabled: Boolean,
    autofocus: Boolean,
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup(props, ctx) {
    const inputRef = ref(null)

    const handleInput = (event: any) => {
      const { value } = event.target

      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    const handleBlur = (event: any) => {
      ctx.emit('change', event.target.value)
    }

    const handleKeyEnter = () => {
      inputRef.value.blur()
    }

    onMounted(() => {
      if (props.autofocus) {
        inputRef.value?.focus()
      }
    })

    return {
      inputRef,
      handleInput,
      handleBlur,
      handleKeyEnter,
    }
  },
})
</script>
