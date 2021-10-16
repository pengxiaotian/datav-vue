<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      v-model="config.iconStyle.show"
      :toggle="true"
      label="图标样式"
    >
      <g-field
        :level="2"
        label="大小"
      >
        <g-slider
          v-model="config.iconStyle.size"
          :min="0"
          :max="100"
          :step="0.1"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.iconStyle.color"
        />
      </g-field>
      <g-field
        :level="2"
        label="边距"
      >
        <g-slider
          v-model="config.iconStyle.marginRight"
          :min="-100"
          :max="100"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="时间器"
    >
      <g-field-collapse
        label="文本样式"
      >
        <g-field
          :level="2"
          tooltip="请选择您系统有的字体，如果您系统无此字体，标题将会显示默认字体"
          label="字体"
        >
          <g-select
            v-model="config.time.textStyle.fontFamily"
            :data="fontFamilys"
          />
        </g-field>
        <g-field
          :level="2"
          label="字号"
        >
          <g-input-number
            v-model="config.time.textStyle.fontSize"
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
            v-model="config.time.textStyle.color"
          />
        </g-field>
        <g-field
          :level="2"
          label="字体粗细"
        >
          <g-select
            v-model="config.time.textStyle.fontWeight"
            :data="fontWeights"
          />
        </g-field>
      </g-field-collapse>
      <g-field
        :level="2"
        tooltip="如：hh:mm:ss为12小时制的格式"
        label="格式化"
      >
        <g-input
          v-model="config.time.format"
        />
      </g-field>
      <g-field
        :level="2"
        label="间隔时间"
      >
        <g-input-number
          v-model="config.time.duration"
          :min="0"
          :step="100"
          suffix="ms"
        />
      </g-field>
      <g-field
        :level="2"
        label="水平对齐"
      >
        <n-radio-group
          v-model:value="config.time.horizontal"
          size="small"
        >
          <n-radio-button
            v-for="em in justifyContents"
            :key="em.id"
            :value="em.id"
          >
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field
        :level="2"
        label="垂直对齐"
      >
        <n-radio-group
          v-model:value="config.time.vertical"
          size="small"
        >
          <n-radio-button
            v-for="em in aligns"
            :key="em.id"
            :value="em.id"
          >
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  fontFamilys,
  fontWeights,
  justifyContents,
  aligns,
} from '@/data/select-options'
import { Timer } from './timer'

export default defineComponent({
  name: 'VTimerProp',
  props: {
    com: {
      type: Object as PropType<Timer>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

      fontFamilys,
      fontWeights,
      justifyContents,
      aligns,
    }
  },
})
</script>
