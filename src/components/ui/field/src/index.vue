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
      <template v-if="tooltip">
        <el-tooltip effect="blue" placement="top" :offset="2">
          <template #content>
            <slot name="tooltip">{{ tooltip }}</slot>
          </template>
          <label class="g-field-title-with-description" :title="label">
            {{ label }}
          </label>
        </el-tooltip>
      </template>
      <label v-else class="g-field-title" :title="label">
        {{ label }}
      </label>
    </el-col>
    <el-col class="g-field-container" v-bind="contentStyle">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
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
