<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="飞线样式"
    >
      <g-field
        :level="2"
        label="起点颜色"
      >
        <g-color-picker
          v-model="config.flyinglineStyle.fromColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="终点颜色"
      >
        <g-color-picker
          v-model="config.flyinglineStyle.toColor"
        />
      </g-field>
      <g-field
        :level="2"
        tooltip="设置大于 0 时忽略动画时长"
        label="固定速度"
      >
        <g-slider
          v-model="config.flyinglineStyle.constantSpeed"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="尾迹长度"
      >
        <g-slider
          v-model="config.flyinglineStyle.trailLength"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </g-field>
      <g-field
        :level="2"
        label="飞线粗细"
      >
        <g-slider
          v-model="config.flyinglineStyle.lineWidth"
          :min="1"
          :max="20"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="高度比例"
      >
        <g-slider
          v-model="config.flyinglineStyle.curveness"
          :min="0"
          :max="1"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="动画时长"
      >
        <g-slider
          v-model="config.flyinglineStyle.period"
          :min="0"
          :max="100"
          :step="1"
          suffix="s"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      v-model="config.flareStyle.show"
      :toggle="true"
      label="耀斑样式"
    >
      <g-field
        :level="2"
        label="类型"
      >
        <g-select
          v-model="config.flareStyle.type"
          :data="flareTypes"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.flareStyle.color"
        />
      </g-field>
      <g-field
        :level="2"
        label="大小"
      >
        <g-slider
          v-model="config.flareStyle.size"
          :min="0"
          :max="20"
          :step="1"
          suffix="px"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      v-model="config.circleStyle.show"
      :toggle="true"
      label="气泡样式"
    >
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.circleStyle.color"
        />
      </g-field>
      <g-field
        :level="2"
        label="半径"
      >
        <g-slider
          v-model="config.circleStyle.radius"
          :min="0"
          :max="30"
          :step="1"
          suffix="px"
        />
      </g-field>
      <g-field
        :level="2"
        label="速率"
      >
        <g-slider
          v-model="config.circleStyle.speed"
          :min="1"
          :max="10"
          :step="0.1"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
} from '@/data/select-options'
import { China2dFlyingline, flareTypes } from './index'

export default defineComponent({
  name: 'VChina2dFlyinglineProp',
  props: {
    com: {
      type: Object as PropType<China2dFlyingline>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

      flareTypes,
    }
  },
})
</script>
