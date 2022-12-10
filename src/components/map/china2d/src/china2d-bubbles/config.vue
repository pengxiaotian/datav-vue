<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="默认样式"
    >
      <g-field
        :level="2"
        label="动画效果"
      >
        <n-radio-group
          v-model:value="config.defaultStyle.effectType"
          size="small"
        >
          <n-radio
            v-for="pair in [
              { key: 'ripple', value: '涟漪动效' },
            ]"
            :key="pair.key"
            :value="pair.key"
          >
            {{ pair.value }}
          </n-radio>
        </n-radio-group>
      </g-field>
      <g-field
        :level="2"
        label="气泡大小"
      >
        <g-slider-range
          v-model="config.defaultStyle.sizeRange"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="呼吸范围"
      >
        <g-slider
          v-model="config.defaultStyle.offset"
          :min="0"
          :max="20"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="透明度"
      >
        <g-slider
          v-model="config.defaultStyle.opacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </g-field>
      <g-field
        :level="2"
        label="动画时长"
      >
        <g-slider
          v-model="config.defaultStyle.period"
          :min="0.1"
          :max="10"
          :step="0.1"
          suffix="s"
        />
      </g-field>
      <g-field
        :level="2"
        label="波纹数量"
      >
        <g-slider
          v-model="config.defaultStyle.number"
          :min="1"
          :max="10"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="绘制方式"
      >
        <g-select-image
          v-model="config.defaultStyle.brushType"
          :images="brushTypes"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="气泡类型"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
      :list="config.typeSeries"
      :min="1"
      :max="10"
      tab="类型"
      :add-item="handleAddTypeSeriesItem"
    >
      <template #default="slotProps">
        <g-field
          :level="2"
          label="类型过滤值"
        >
          <g-input
            v-model="slotProps.item.bubbleType"
          />
        </g-field>
        <g-field
          :level="2"
          label="气泡类型"
        >
          <g-select-shape
            v-model="slotProps.item.bubbleKey"
            :shapes="bubbleTypes"
          />
        </g-field>
        <g-field
          :level="2"
          label="填充颜色"
        >
          <g-color-picker
            v-model="slotProps.item.fillColor"
          />
        </g-field>
      </template>
    </g-field-collapse>
  </div>
</template>

<script lang='ts' setup>
import { toRef } from 'vue'
import { China2dBubbles, bubbleTypes, brushTypes } from './index'

const props = defineProps<{
  com: China2dBubbles
}>()

const config = toRef(props.com, 'config')

const handleAddTypeSeriesItem = () => {
  return {
    bubbleType: '1',
    bubbleKey: 'circle',
    fillColor: 'rgba(198, 236, 238, 1)',
  }
}
</script>
