<template>
  <template v-for="item in config" :key="item.key">
    <preview-prop-item
      v-if="isFlat"
      :data-type="item.config.type"
      :component-type="item.config.component"
      :default-value="item.config.defaultValue"
      :min="item.config.min"
      :max="item.config.max"
      :step="item.config.step"
      :suffix="item.config.suffix"
      :label="item.config.alias"
      :is-flat="true"
    />
    <template v-else-if="item.children">
      <g-field-collapse
        v-if="item.config.displayMode === 'nest'"
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
        v-else-if="item.config.displayMode === 'flat'"
        :label="item.config.alias"
        :tooltip="item.config.tip"
        :level="level"
        :is-flat="true"
      >
        <preview-prop
          :config="item.children"
          :toggle-col="item.config.toggleCol"
          :is-flat="true"
          :level="2"
        />
      </g-field>
    </template>
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
    isFlat: Boolean,
  },
})
</script>
