<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      v-model="config.global.manualArrangement"
      :toggle="true"
      label="布局控制"
    >
      <g-field
        :level="2"
        label="布局方式"
      >
        <n-radio-group
          v-model:value="config.global.layout"
          size="small"
        >
          <n-radio-button
            v-for="pair in [
              { key: 'row', value: '横向布局' },
              { key: 'column', value: '纵向布局' },
            ]"
            :key="pair.key"
            :value="pair.key"
          >
            {{ pair.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field
        v-if="config.global.layout === 'row'"
        :level="2"
        label="每行个数"
      >
        <g-input-number
          v-model="config.global.rowNum"
          :min="1"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        v-if="config.global.layout === 'column'"
        :level="2"
        label="第列个数"
      >
        <g-input-number
          v-model="config.global.colNum"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="间距"
    >
      <g-field
        :level="2"
        label="垂直"
      >
        <g-input-number
          v-model="config.spacing.vertical"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="水平"
      >
        <g-input-number
          v-model="config.spacing.horizontal"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="文本样式"
    >
      <g-field
        :level="2"
        tooltip="请选择您系统有的字体,如果您系统无此字体,标题将会显示默认字体"
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
        label="颜色"
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
      label="状态种类"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
      :list="config.statusArray"
      :min="0"
      :max="100"
      :add-item="handleAddStatusArrayItem"
    >
      <template #default="slotProps">
        <g-field
          :level="2"
          tooltip="状态类型需要与数据匹配"
          label="状态类型名"
        >
          <g-input
            v-model="slotProps.item.value"
          />
        </g-field>
        <g-field
          :level="2"
          label="圆点颜色"
        >
          <g-color-picker
            v-model="slotProps.item.color"
          />
        </g-field>
      </template>
    </g-field-collapse>
    <g-field-collapse
      label="圆点样式"
    >
      <g-field
        :level="2"
        label="位置"
      >
        <g-select
          v-model="config.pointStyle.position"
          :data="[
            { key: 'left', value: '左侧' },

            { key: 'right', value: '右侧' },
          ] || []"
        />
      </g-field>
      <g-field
        :level="2"
        label="宽度"
      >
        <g-input-number
          v-model="config.pointStyle.width"
          :min="1"
          :max="50"
          :step="1"
          suffix="px"
        />
      </g-field>
      <g-field
        :level="2"
        label="高度"
      >
        <g-input-number
          v-model="config.pointStyle.height"
          :min="1"
          :max="50"
          :step="1"
          suffix="px"
        />
      </g-field>
      <g-field
        :level="2"
        label="圆角大小"
      >
        <g-slider
          v-model="config.pointStyle.borderRadius"
          :min="0"
          :max="100"
          :step="1"
          suffix="%"
        />
      </g-field>
      <g-field
        :level="2"
        tooltip="文字到时状态点的间距"
        label="间距"
      >
        <g-input-number
          v-model="config.pointStyle.spacing"
          :min="0"
          :max="100"
          :step="1"
          suffix="px"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts' setup>
import { toRef, defineProps } from 'vue'
import {
  fontFamilys,
  fontWeights,
} from '@/data/select-options'
import type { StatusCard } from './status-card'

type Props = {
  com: StatusCard
}
const props = defineProps<Props>()

const config = toRef(props.com, 'config')
</script>

<script lang="ts">
export default {
  name: 'VStatusCardProp',
}
</script>
