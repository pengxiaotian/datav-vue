<template>
  <div class="setting-panel-gui">
    <g-field
      label="链接"
    >
      <g-input
        v-model="config.url"
      />
    </g-field>
    <g-field
      label="关闭按钮"
    >
      <n-switch
        v-model:value="config.closeButton"
      />
    </g-field>
    <g-field
      v-if="config.closeButton === true"
      label="始终显示关闭按钮"
    >
      <n-switch
        v-model:value="config.alwaysShowCloseButton"
      />
    </g-field>
    <g-field
      label="不可滚动"
    >
      <n-switch
        v-model:value="config.noScrolling"
      />
    </g-field>
  </div>
</template>

<script lang='ts' setup>
import { toRef, defineProps } from 'vue'
import {
} from '@/data/select-options'
import type { Iframe } from './iframe'

type Props = {
  com: Iframe
}
const props = defineProps<Props>()

const config = toRef(props.com, 'config')
</script>

<script lang="ts">
export default {
  name: 'VIframeProp',
}
</script>
