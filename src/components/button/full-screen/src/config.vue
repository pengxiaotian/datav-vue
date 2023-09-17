<template>
  <div class="setting-panel-gui">
    <g-field
      label="全屏显示"
    >
      <g-upload-image
        v-model="config.request"
      />
    </g-field>
    <g-field
      label="退出全屏"
    >
      <g-upload-image
        v-model="config.exit"
      />
    </g-field>
    <g-field
      label="背景颜色"
    >
      <g-color-picker
        v-model="config.bgColor"
      />
    </g-field>
    <g-field
      label="圆角"
    >
      <g-slider
        v-model="config.borderRadius"
        :min="0"
        :max="100"
        :step="1"
        suffix="%"
      />
    </g-field>
    <g-field
      label="始终显示图片背景"
    >
      <g-switch
        v-model="config.alwaysShow"
      />
    </g-field>
  </div>
</template>

<script lang='ts' setup>
import { toRef } from 'vue'
import { FullScreen } from './full-screen'

const props = defineProps<{
  com: FullScreen
}>()

const config = toRef(props.com, 'config')

</script>
