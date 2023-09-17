<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="框"
    >
      <g-field
        :level="2"
        label="样式"
      >
        <g-select-image
          v-model="config.boxStyle.style"
          :images="presetImages"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts' setup>
import { toRef } from 'vue'
import { BorderBox, presetImages } from './border-box'

const props = defineProps<{
  com: BorderBox
}>()

const config = toRef(props.com, 'config')

</script>
