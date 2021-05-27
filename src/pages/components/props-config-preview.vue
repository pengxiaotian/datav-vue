<template>
  <template v-for="item in configs" :key="item.key">
    <g-field-collapse
      v-if="item.children"
      :label="item.config.alias"
      :tooltip="item.config.tip"
      :toggle="!!item.config.toggleCol"
      :model-value="true"
    >
      <props-config-preview
        :configs="item.children"
        :toggle-col="item.config.toggleCol"
        :level="2"
      />
    </g-field-collapse>
    <g-field
      v-else-if="toggleCol !== item.key"
      :label="item.config.alias"
      :tooltip="item.config.tip"
      :level="level"
    >
      <prop-component-preview
        :data-type="item.config.type"
        :component-type="item.config.component"
        :default-value="item.config.defaultValue"
        :min="item.config.min"
        :max="item.config.max"
        :step="item.config.step"
      />
    </g-field>
  </template>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { PropDto } from '@/domains/dev/prop-config'
import {
  fontFamilys,
  fontWeights,
  fontStyles,
  hAligns,
  vAligns,
  writingModes,
  justifyContents,
  aligns,
  angles,
  locations,
  lineStyles,
  fillTypes,
} from '@/data/select-options'
import { boxImgs, decorateImgs } from '@/data/images'
import PropComponentPreview from './prop-component-preview.vue'

export default defineComponent({
  name: 'PropsConfigPreview',
  components: {
    PropComponentPreview,
  },
  props: {
    configs: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
    toggleCol: String,
    level: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    return {
      fontFamilys,
      fontWeights,
      fontStyles,
      hAligns,
      vAligns,
      writingModes,
      justifyContents,
      aligns,
      angles,
      locations,
      lineStyles,
      fillTypes,
      boxImgs,
      decorateImgs,
    }
  },
})
</script>
