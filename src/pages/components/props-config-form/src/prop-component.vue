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
  <el-color-picker
    v-else-if="componentType === componentTypes.color"
    v-model="strValue"
    show-alpha
  />
  <el-select
    v-else-if="componentType === componentTypes.select"
    v-model="arrValue"
    multiple
    filterable
    allow-create
    placeholder="创建下拉选项"
  />
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
    v-else-if="componentType === componentTypes.justifyContent"
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
      v-for="item in boxImgs"
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
  name: 'PropComponent',
  props: {
    dataType: {
      type: String as PropType<PropDataType>,
      required: true,
    },
    componentType: {
      type: String as PropType<ComponentType>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, ctx) {
    const componentTypes = ref({ ...ComponentType })

    const strValue = ref('')
    const numValue = ref(0)
    const boolValue = ref(false)
    const arrValue = ref<string[]>([])

    watch(() => strValue.value, (nv: string) => {
      ctx.emit('change', nv)
    })

    watch(() => numValue.value, (nv: number) => {
      ctx.emit('change', nv)
    })

    watch(() => boolValue.value, (nv: boolean) => {
      ctx.emit('change', nv)
    })

    watch(() => arrValue.value, (nv: string[]) => {
      ctx.emit('change', nv)
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
