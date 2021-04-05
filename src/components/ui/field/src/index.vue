<template>
  <el-row
    :class="[
      'g-field-wp',
      `--lv${level}`,
      { '--disable': toggle && !modelValue }
    ]"
  >
    <el-col class="g-field" v-bind="labelStyle">
      <i class="g-field-show-placeholder">
        <i
          v-if="toggle"
          :class="['g-field-show', modelValue ? 'v-icon-show' : 'v-icon-hide']"
          @click="toggleVisible"
        ></i>
      </i>
      <label class="g-field-text" :title="label">{{ label }}</label>
      <el-tooltip
        v-if="tooltip"
        placement="right"
        effect="blue"
      >
        <template #content>
          <slot name="tooltip">{{ tooltip }}</slot>
        </template>
        <i class="v-icon-help g-field-help"></i>
      </el-tooltip>
    </el-col>
    <el-col class="g-field-container" v-bind="contentStyle">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GField',
  props: {
    label: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
    },
    toggle: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    nest: {
      type: Boolean,
      default: false,
    },
  },
  emits: [UPDATE_MODEL_EVENT],
  setup(props, ctx) {
    const toggleVisible = () => {
      ctx.emit(UPDATE_MODEL_EVENT, !props.modelValue)
    }

    const labelStyle = computed(() => {
      return {
        span: props.nest ? 24 : 8,
      }
    })

    const contentStyle = computed(() => {
      // const isNest = props.nest || props.level === 1
      return {
        span: props.nest ? 24 : 14,
        offset: props.nest ? 0 : 2,
      }
    })

    return {
      toggleVisible,
      labelStyle,
      contentStyle,
    }
  },
})
</script>
