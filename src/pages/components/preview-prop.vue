<template>
  <template v-for="item in config" :key="item.key">
    <g-field-collapse
      v-if="item.children"
      :label="item.config.alias"
      :tooltip="item.config.tip"
      :toggle="!!item.config.toggleCol"
      :model-value="true"
    >
      <preview-prop
        :config="item.children"
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
      <preview-prop-item
        :data-type="item.config.type"
        :component-type="item.config.component"
        :default-value="item.config.defaultValue"
        :min="item.config.min"
        :max="item.config.max"
        :step="item.config.step"
        :suffix="item.config.suffix"
      />
    </g-field>
  </template>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { PropDto } from '@/domains/dev/prop-config'
import PreviewPropItem from './preview-prop-item.vue'

export default defineComponent({
  name: 'PreviewProp',
  components: {
    PreviewPropItem,
  },
  props: {
    config: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
    toggleCol: String,
    level: {
      type: Number,
      default: 1,
    },
  },
})
</script>
