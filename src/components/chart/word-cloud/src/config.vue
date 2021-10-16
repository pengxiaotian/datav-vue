<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="全局样式"
    >
      <g-field
        :level="2"
        tooltip="请选择您系统有的字体，如果您系统无此字体，标题将会显示默认字体"
        label="字体"
      >
        <g-select
          v-model="config.global.fontFamily"
          :data="fontFamilys"
        />
      </g-field>
      <g-field
        :level="2"
        label="最大字号"
      >
        <g-slider
          v-model="config.global.max"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="最小字号"
      >
        <g-slider
          v-model="config.global.min"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="旋转范围"
        :is-flat="true"
      >
        <g-input-number
          v-model="config.global.rotationRange.min"
          :min="-360"
          :max="360"
          :step="1"
          inline="inline"
          label="最小角度"
        />
        <g-input-number
          v-model="config.global.rotationRange.max"
          :min="-360"
          :max="360"
          :step="1"
          inline="inline"
          label="最小角度"
        />
      </g-field>
      <g-field
        :level="2"
        label="旋转步长"
      >
        <g-slider
          v-model="config.global.rotate"
          :min="0"
          :max="360"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="绘制类型"
      >
        <n-radio-group
          v-model:value="config.global.drawType"
          size="small"
        >
          <n-radio-button
            v-for="em in drawTypes"
            :key="em.id"
            :value="em.id"
          >
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field
        v-if="config.global.drawType === 'preset'"
        :level="2"
        label="图形"
      >
        <n-radio-group
          v-model:value="config.global.shape"
          size="small"
        >
          <n-radio-button
            v-for="em in simpleShapes"
            :key="em.id"
            :value="em.id"
          >
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field
        v-if="config.global.drawType === 'image'"
        :level="2"
        label="形状图片"
      >
        <g-upload-image
          v-model="config.global.image"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="系列"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical','horizontal','copy','add','remove']"
      :list="config.series"
      :min="0"
      :max="100"
      tab="系列"
      :add-item="handleAddSeriesItem"
    >
      <template #default="slotProps">
        <g-field
          :level="2"
          label="系列名称"
        >
          <g-input
            v-model="slotProps.item.name"
          />
        </g-field>
        <g-field
          :level="2"
          label="颜色"
        >
          <g-color-picker
            v-model="slotProps.item.color"
          />
        </g-field>
      </template>
    </g-field-collapse>
    <g-field-collapse
      v-model="config.tooltip.show"
      :toggle="true"
      label="提示框"
    >
      <g-field
        :level="2"
        label="文本样式"
        :is-flat="true"
      >
        <g-input-number
          v-model="config.tooltip.textStyle.fontSize"
          :min="12"
          :max="100"
          :step="1"
          suffix="px"
          inline="inline"
          label="字号"
        />
        <g-color-picker
          v-model="config.tooltip.textStyle.color"
          inline="inline"
          label="颜色"
        />
        <g-select
          v-model="config.tooltip.textStyle.fontWeight"
          :data="fontWeights"
          inline="inline-single"
          label="字体粗细"
        />
      </g-field>
      <g-field
        :level="2"
        label="背景颜色"
      >
        <g-color-picker
          v-model="config.tooltip.backgroundColor"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  fontFamilys,
  fontWeights,
} from '@/data/select-options'
import { WordCloud, WordCloudSeries, drawTypes, simpleShapes } from './word-cloud'

export default defineComponent({
  name: 'VWordCloudProp',
  props: {
    com: {
      type: Object as PropType<WordCloud>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const handleAddSeriesItem = () => {
      return new WordCloudSeries(`系列${config.value.series.length + 1}`, '#fff')
    }

    return {
      config,

      fontFamilys,
      fontWeights,
      drawTypes,
      simpleShapes,
      handleAddSeriesItem,
    }
  },
})
</script>
