<template>
  <div class="g-nested-loading">
    <div
      v-if="spinning"
      class="g-loading-mask"
      :class="spinContentClass"
      :style="spinning ? spinContentStyle : {}"
    >
      <div class="g-loading">
        <div v-if="type === 'dna'" class="loading-dna">
          <div v-for="i in 45" :key="i" class="dna-ele">
            <div class="dna-dot"></div>
          </div>
        </div>
        <div v-else>
          {{ type }}
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'GLoading',
  props: {
    type: {
      type: String as PropType<'dna'>,
      default: 'dna',
    },
    spinning: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String as PropType<'dark' | 'light'>,
      default: 'dark',
    },
    opacity: {
      type: Number,
      default: 0.8,
    },
    wrapClass: {
      type: String,
    },
    wrapStyle: {
      type: {} as PropType<Record<string, any>>,
    },
  },
  setup(props) {
    const opacity = props.opacity > 1 ? 1 : props.opacity < 0 ? 0 : props.opacity

    const spinContentClass = ref('')
    if (props.spinning) {
      if (props.wrapClass) {
        spinContentClass.value += ` ${props.wrapClass}`
      }
    } else {
      spinContentClass.value = ''
    }

    const spinContentStyle = ref({
      ...props.wrapStyle,
      background: props.theme === 'dark' ? `rgba(23,27,34,${opacity})` : `rgba(255, 255, 255, ${opacity})`,
    })

    return {
      spinContentClass,
      spinContentStyle,
    }
  },
})
</script>
