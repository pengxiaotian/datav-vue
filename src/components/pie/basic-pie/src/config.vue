<template>
  <div class="setting-panel-gui">
    <g-field
      label="文本样式"
      :is-flat="true"
    >
      <g-input
        v-model="config.textStyle.color"
        inline="inline"
        label="颜色"
      />
      <g-input
        v-model="config.textStyle.value"
        inline="inline"
        label="值"
      />
    </g-field>
  </div>
</template>

<script lang='ts' setup>
import { toRef } from 'vue'
import {
} from '@/data/select-options'
import { BasicPie } from './basic-pie'

const props = defineProps<{
  com: BasicPie
}>()

const config = toRef(props.com, 'config')

</script>
