<template>
  <div class="filter-toolbox-panel">
    <div class="content">
      <div class="gui-wrap">
        <g-field
          :disabled="!styleFilterParams.enable"
          label="色相"
          caption="色相: [ 0, 360 ]"
        >
          <g-slider
            v-model="styleFilterParams.hue"
            :min="0"
            :max="360"
            size="large"
            suffix="度"
          />
        </g-field>
        <g-field
          :disabled="!styleFilterParams.enable"
          label="饱和度"
          caption="饱和度: [ 0, 200 ]"
        >
          <g-slider
            v-model="styleFilterParams.saturate"
            :min="0"
            :max="200"
            size="large"
            suffix="%"
          />
        </g-field>
        <g-field
          :disabled="!styleFilterParams.enable"
          label="亮度"
          caption="亮度: [ 0, 200 ]"
        >
          <g-slider
            v-model="styleFilterParams.brightness"
            :min="0"
            :max="200"
            size="large"
            suffix="%"
          />
        </g-field>
        <g-field
          :disabled="!styleFilterParams.enable"
          label="对比度"
          caption="对比度: [ 0, 200 ]"
        >
          <g-slider
            v-model="styleFilterParams.contrast"
            :min="0"
            :max="200"
            size="large"
            suffix="%"
          />
        </g-field>
        <g-field
          :disabled="!styleFilterParams.enable"
          label="不透明度"
          caption="不透明度: [ 0, 100 ]"
        >
          <g-slider
            v-model="styleFilterParams.opacity"
            :min="0"
            :max="100"
            size="large"
            suffix="%"
          />
        </g-field>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PageStyleFilter } from '@/domains/editor'

export default defineComponent({
  name: 'ToolboxFilterPanel',
  props: {
    styleFilterParams: {
      type: Object as PropType<PageStyleFilter>,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

.filter-toolbox-panel {
  background: #1d2125;

  .content {
    width: 320px;

    .gui-wrap {
      padding: 12px;
    }
  }
}
</style>
