<template>
  <div class="g-nested-loading">
    <div
      v-if="spinning"
      class="g-loading-mask"
      :class="spinContentClass"
      :style="spinning ? spinContentStyle : {}"
    >
      <div class="g-loading">
        <div v-if="type === 'dna'" class="dna-loading">
          <div v-for="i in 60" :key="i" class="dna-ele">
            <div class="dna-dot"></div>
          </div>
        </div>
        <div v-else-if="type === 'square'" class="square-loading">
          <i class="loading-icon validating"></i>
          <i class="loading-icon validating"></i>
          <i class="loading-icon validating"></i>
        </div>
        <div v-else>
          {{ type }}
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang='ts' setup>
import { PropType, ref } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'dna' | 'square'>,
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
    default: 1,
  },
  wrapClass: {
    type: String,
  },
  wrapStyle: {
    type: {} as PropType<Record<string, any>>,
  },
})

const opacity = props.opacity > 1 ? 1 : props.opacity < 0 ? 0 : props.opacity

const spinContentClass = ref('')
if (props.spinning) {
  if (props.wrapClass) {
    spinContentClass.value += ` ${props.wrapClass}`
  }
} else {
  spinContentClass.value = ''
}

const wrapStyle: Record<string, any> = props.wrapStyle || {}
const spinContentStyle = ref({
  ...wrapStyle,
  background: props.theme === 'dark'
    ? `rgba(23,27,34,${opacity})`
    : `rgba(255, 255, 255, ${opacity})`,
})
</script>
