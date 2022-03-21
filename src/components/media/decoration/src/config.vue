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
          :images="images"
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

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import { Decoration, presetImages } from './decoration'
import { BorderImage } from '@/components/_models/border-image'

export default defineComponent({
  name: 'VDecorationProp',
  props: {
    com: {
      type: Object as PropType<Decoration>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const images: BorderImage[] = []
    for (const key in presetImages) {
      const item = presetImages[key]
      images.push({
        id: key,
        name: key,
        src: item.url,
      })
    }

    return {
      config,
      images,
    }
  },
})
</script>
