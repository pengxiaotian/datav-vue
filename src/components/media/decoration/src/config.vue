<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="全局"
    >
      <g-field
        :level="2"
        label="装饰元素"
      >
        <g-select-image
          v-model="config.global.img"
          :images="presetImages"
        />
      </g-field>
      <g-field
        :level="2"
        label="透明度"
      >
        <g-slider
          v-model="config.global.opacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts' setup>
import { toRef } from 'vue'
import { Decoration, presetImages } from './decoration'

const props = defineProps<{
  com: Decoration
}>()

const config = toRef(props.com, 'config')

</script>
