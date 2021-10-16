<template>
  <div class="setting-panel-gui">
    <g-field
      tooltip="支持从数据中获取标题内容，详见数据面板"
      label="段落内容"
    >
      <g-input
        v-model="config.content"
      />
    </g-field>
    <g-field-collapse
      label="文本样式"
    >
      <g-field
        :level="2"
        tooltip="请选择您系统有的字体，如果您系统无此字体，标题将会显示默认字体"
        label="字体"
      >
        <g-select
          v-model="config.textStyle.fontFamily"
          :data="fontFamilys"
        />
      </g-field>
      <g-field
        :level="2"
        label="字号"
      >
        <g-input-number
          v-model="config.textStyle.fontSize"
          :min="12"
          :max="100"
          :step="1"
          suffix="px"
        />
      </g-field>
      <g-field
        :level="2"
        label="字体颜色"
      >
        <g-color-picker
          v-model="config.textStyle.color"
        />
      </g-field>
      <g-field
        :level="2"
        label="字体粗细"
      >
        <g-select
          v-model="config.textStyle.fontWeight"
          :data="fontWeights"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="文本滚落"
    >
      <g-field
        :level="2"
        label="滚动持续时间"
      >
        <g-input-number
          v-model="config.scroll.duration"
          :min="0"
          :step="100"
        />
      </g-field>
      <g-field
        :level="2"
        tooltip="仅当文本溢出时有效"
        label="溢出滚动"
      >
        <n-switch
          v-model:value="config.scroll.overScroll"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      label="行高"
    >
      <g-slider
        v-model="config.lineHeight"
        :min="0"
        :max="100"
        :step="1"
      />
    </g-field>
    <g-field
      label="对齐方式"
    >
      <g-select
        v-model="config.textAlign"
        :data="hAligns"
      />
    </g-field>
    <g-field
      label="首行缩进"
    >
      <g-slider
        v-model="config.textIndent"
        :min="0"
        :max="10000"
        :step="1"
      />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  fontFamilys,
  fontWeights,
  hAligns,
} from '@/data/select-options'
import { Paragraph } from './paragraph'

export default defineComponent({
  name: 'VParagraphProp',
  props: {
    com: {
      type: Object as PropType<Paragraph>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

      fontFamilys,
      fontWeights,
      hAligns,
    }
  },
})
</script>
