<template>
  <div class="basic-setting-wp">
    <g-field label="图表尺寸">
      <g-input-number v-model="attr.w" :min="0" :max="8888" />
      <g-input-number v-model="attr.h" :min="0" :max="8888" />
    </g-field>
    <g-field label="图表位置">
      <g-input-number v-model="attr.x" />
      <g-input-number v-model="attr.y" />
    </g-field>
    <g-field label="旋转角度">
      <g-input-number
        v-model="attr.deg"
        :min="0"
        :max="360"
        :step="1"
      />
    </g-field>
    <g-field label="透明度">
      <el-slider
        v-model="attr.opacity"
        :min="0"
        :max="1"
        :step="0.05"
        :show-tooltip="false"
        show-input
        input-size="mini"
        class="g-slider"
      />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { ComponentAttr } from '@/components/datav-component'

export default defineComponent({
  name: 'BasicSetting',
  props: {
    attr: {
      type: Object as PropType<ComponentAttr>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.basic-setting-wp {
  user-select: none;
}
</style>
