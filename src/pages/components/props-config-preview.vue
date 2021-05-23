<template>
  <div class="setting-panel">
    <div class="setting-panel-content">
      <div class="scroll-container">
        <div class="setting-panel-detail">
          <template v-for="item in configs" :key="item.key">
            <g-field-collapse
              v-if="item.children"
              :label="item.config.alias"
              :tooltip="item.config.tip"
            >
              <template v-for="subitem in item.children" :key="subitem.key">
                <g-field
                  :label="subitem.config.alias"
                  :tooltip="subitem.config.tip"
                  :level="2"
                >
                  <prop-component-preview
                    :data-type="subitem.config.type"
                    :component-type="subitem.config.component"
                    :default-value="subitem.config.defaultValue"
                  />
                </g-field>
              </template>
            </g-field-collapse>
            <g-field
              v-else
              :label="item.config.alias"
              :tooltip="item.config.tip"
            >
              <prop-component-preview
                :data-type="item.config.type"
                :component-type="item.config.component"
                :default-value="item.config.defaultValue"
              />
            </g-field>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import { PropDto, ComponentType, DisplayMode } from '@/domains/dev/prop-config'
import {
  fontFamilys,
  fontWeights,
  fontStyles,
  hAligns,
  vAligns,
  writingModes,
  justifyContents,
  aligns,
  angles,
  locations,
  lineStyles,
  fillTypes,
} from '@/data/select-options'
import { boxImgs, decorateImgs } from '@/data/images'
import PropComponentPreview from './prop-component-preview.vue'

export default defineComponent({
  name: 'PropsConfigForm',
  components: {
    PropComponentPreview,
  },
  props: {
    configs: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
  },
  setup() {
    const componentTypes = ref({ ...ComponentType })
    const displayModes = ref({ ...DisplayMode })

    return {
      componentTypes,
      displayModes,

      fontFamilys,
      fontWeights,
      fontStyles,
      hAligns,
      vAligns,
      writingModes,
      justifyContents,
      aligns,
      angles,
      locations,
      lineStyles,
      fillTypes,
      boxImgs,
      decorateImgs,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.setting-panel {
  position: relative;
  width: 332px;
  height: 100vh;
}

.setting-panel-content {
  position: absolute;
  top: 12px;
  bottom: 12px;
  width: 100%;
  overflow-y: auto;
}

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 534px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
