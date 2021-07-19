<template>
  <div class="basic-setting-wp">
    <g-field label="图表尺寸" :is-flat="true">
      <g-input-number
        v-model="attr.w"
        :min="0"
        :max="8888"
        :is-inline="true"
      />
      <g-input-number
        v-model="attr.h"
        :min="0"
        :max="8888"
        :is-inline="true"
      />
    </g-field>
    <g-field label="图表位置" :is-flat="true">
      <g-input-number v-model="attr.x" :is-inline="true" />
      <g-input-number v-model="attr.y" :is-inline="true" />
    </g-field>
    <g-field label="旋转角度" :is-flat="true">
      <g-input-number
        v-model="attr.deg"
        :min="0"
        :max="360"
        :step="1"
        :is-inline="true"
      />
      <el-checkbox-group v-model="filps" size="mini" @change="onFilpChange">
        <el-tooltip effect="blue" content="垂直翻转" :enterable="false">
          <el-checkbox-button label="v">
            <i class="v-icon-flip-v"></i>
          </el-checkbox-button>
        </el-tooltip>
        <el-tooltip effect="blue" content="水平翻转" :enterable="false">
          <el-checkbox-button label="h">
            <i class="v-icon-flip-h"></i>
          </el-checkbox-button>
        </el-tooltip>
      </el-checkbox-group>
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
import { defineComponent, PropType, ref, onMounted } from 'vue'
import { ComponentAttr } from '@/components/datav-component'

type filpType = 'v' | 'h'

export default defineComponent({
  name: 'BasicSetting',
  props: {
    attr: {
      type: Object as PropType<ComponentAttr>,
      required: true,
    },
  },
  setup(props) {
    const filps = ref<filpType[]>([])

    const onFilpChange = (keys: filpType[]) => {
      filps.value = [...keys]
      props.attr.filpV = keys.includes('v')
      props.attr.filpH = keys.includes('h')
    }

    onMounted(() => {
      if (props.attr.filpV) {
        filps.value.push('v')
      }

      if (props.attr.filpH) {
        filps.value.push('h')
      }
    })

    return {
      filps,
      onFilpChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.basic-setting-wp {
  user-select: none;
}
</style>
