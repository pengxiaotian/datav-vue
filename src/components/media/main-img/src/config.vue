<template>
  <div class="setting-panel-gui">
    <g-field
      label="图片类型"
    >
      <g-radio-group
        v-model="config.imageType"
        :data="imageTypes"
        is-button
      />
    </g-field>
    <g-field
      label="背景图"
    >
      <g-upload-image
        v-model="config.backgroundImage"
      />
    </g-field>
    <g-field
      v-if="config.imageType === 'vector'"
      label="矢量图"
    >
      <g-upload-image
        v-model="config.vectorImage"
      />
    </g-field>
    <g-field
      v-if="config.imageType === 'vector'"
      label="填充色"
    >
      <g-color-picker
        v-model="config.vectorFill"
      />
    </g-field>
    <g-field
      label="图片重复"
    >
      <g-select
        v-model="config.repeat"
        :data="repeatTypes"
      />
    </g-field>
    <g-field
      label="圆角"
    >
      <g-input-number
        v-model="config.radius"
        :min="0"
        :step="1"
        suffix="px"
      />
    </g-field>
    <g-field-collapse
      tooltip="点击图片区域可跳转至设定的超链接"
      label="超链接配置"
    >
      <g-field
        :level="2"
        label="超链接"
      >
        <g-input
          v-model="config.urlConfig.url"
        />
      </g-field>
      <g-field
        :level="2"
        label="是否打开新窗口"
      >
        <g-switch
          v-model="config.urlConfig.ifBlank"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      label="手势光标"
    >
      <g-switch
        v-model="config.cursor"
      />
    </g-field>
  </div>
</template>

<script lang='ts' setup>
import { toRef } from 'vue'
import {
  imageTypes,
  repeatTypes,
} from '@/data/select-options'
import { MainImg } from './main-img'

const props = defineProps<{
  com: MainImg
}>()

const config = toRef(props.com, 'config')

</script>
