<template>
  <div class="setting-panel-gui">
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
    <g-field
      label="是否轮播"
    >
      <n-switch
        v-model:value="config.loop"
      />
    </g-field>
    <g-field
      label="定速播放"
    >
      <n-switch
        v-model:value="config.ifSpeed"
      />
    </g-field>
    <g-field
      v-if="config.ifSpeed === false"
      label="动画时间"
    >
      <g-input-number
        v-model="config.duration"
        :min="0"
        :step="100"
        suffix="ms"
      />
    </g-field>
    <g-field
      v-if="config.ifSpeed === true"
      tooltip="每100长度动画时长"
      label="动画间隔"
    >
      <g-input-number
        v-model="config.speed"
        :min="0"
        :step="100"
        suffix="ms"
      />
    </g-field>
    <g-field
      label="每次停留"
    >
      <g-input-number
        v-model="config.timeout"
        :min="0"
        :step="100"
        suffix="ms"
      />
    </g-field>
  </div>
</template>

<script lang='ts' setup>
import { toRef } from 'vue'
import {
  fontFamilys,
  fontWeights,
} from '@/data/select-options'
import { Marquee } from './marquee'

const props = defineProps<{
  com: Marquee
}>()

const config = toRef(props.com, 'config')

</script>
