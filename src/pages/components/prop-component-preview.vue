<template>
  <el-input
    v-if="componentType === componentTypes.input"
    v-model="strValue"
    size="mini"
  />
  <g-input-number
    v-else-if="componentType === componentTypes.number"
    v-model="numValue"
    :min="0"
    :max="8888"
    :is-inline="false"
  />
  <el-checkbox
    v-else-if="componentType === componentTypes.checkbox"
    v-model="boolValue"
  />
  <el-switch
    v-else-if="componentType === componentTypes.switch"
    v-model="boolValue"
  />
  <g-color-picker
    v-else-if="componentType === componentTypes.color"
    v-model="strValue"
  />
  <el-slider
    v-else-if="componentType === componentTypes.slider"
    v-model="numValue"
    :min="0"
    :max="1"
    :step="0.05"
    :show-tooltip="false"
    show-input
    input-size="mini"
    class="g-slider"
    style="width: 184px;"
  />
  <el-select
    v-else-if="componentType === componentTypes.select"
    v-model="arrValue"
    multiple
    filterable
    allow-create
    default-first-option
    placeholder="创建下拉选项"
    size="mini"
  />
  <el-select
    v-else-if="componentType === componentTypes.fontFamily"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in fontFamilys"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.fontWeight"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in fontWeights"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.fontStyle"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in fontStyles"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.hAlign"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in hAligns"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.vAlign"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in vAligns"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.writingMode"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in writingModes"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.justify"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in justifyContents"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.align"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in aligns"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.angle"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in angles"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.location"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in locations"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.lineStyle"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in lineStyles"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.fillType"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in fillTypes"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.box"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in boxImgs"
      :key="item.id"
      :label="item.src"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.decorate"
    v-model="strValue"
    size="mini"
  >
    <el-option
      v-for="item in decorateImgs"
      :key="item.id"
      :label="item.src"
      :value="item.id"
    />
  </el-select>
  <span v-else>--</span>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, watch } from 'vue'
import { PropDataType, ComponentType } from '@/domains/dev/prop-config'
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

export default defineComponent({
  name: 'PropComponentPreview',
  props: {
    dataType: {
      type: String as PropType<PropDataType>,
      required: true,
    },
    componentType: {
      type: String as PropType<ComponentType>,
      required: true,
    },
    defaultValue: {
      type: [String, Number, Boolean, Array, Object],
    },
  },
  setup(props) {
    const componentTypes = ref({ ...ComponentType })

    const strValue = ref('')
    const numValue = ref(0)
    const boolValue = ref(false)
    const arrValue = ref<(string | number)[]>([])

    watch(
      () => props.componentType,
      () => {
        const dv = props.defaultValue
        if (dv !== undefined) {
          if (props.dataType === PropDataType.string) {
            strValue.value = dv as string
          } else if (props.dataType === PropDataType.number) {
            numValue.value = dv as number
          } else if (props.dataType === PropDataType.boolean) {
            boolValue.value = dv as boolean
          } else if (props.dataType === PropDataType.array) {
            arrValue.value = dv as (string | number)[]
          }
        }
      }, {
        immediate: true,
      })

    return {
      componentTypes,
      strValue,
      numValue,
      boolValue,
      arrValue,

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

<style lang="scss" scoped>
@import '~@/styles/themes/var';
</style>
