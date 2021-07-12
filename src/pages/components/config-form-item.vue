<template>
  <el-input
    v-if="componentType === componentTypes.input"
    v-model="strValue"
  />
  <el-input-number
    v-else-if="componentType === componentTypes.number"
    v-model="numValue"
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
    size="medium"
  />
  <el-slider
    v-else-if="componentType === componentTypes.slider"
    v-model="numValue"
    :show-tooltip="false"
    show-input
    input-size="medium"
    class="g-slider"
    style="width: 232px;"
  />
  <el-select
    v-else-if="componentType === componentTypes.select"
    v-model="strValue"
    disabled
  >
    <el-option
      v-for="item in []"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.fontFamily"
    v-model="strValue"
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
  >
    <el-option
      v-for="item in []"
      :key="item.id"
      :label="item.src"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="componentType === componentTypes.decorate"
    v-model="strValue"
  >
    <el-option
      v-for="item in []"
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

export default defineComponent({
  name: 'ConfigFormItem',
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
    }
  },
})
</script>
