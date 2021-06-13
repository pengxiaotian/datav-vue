<template>
  <div class="setting-panel-gui">
    <g-field
      label="标题名"
      tooltip="支持从数据中获取标题内容,详见数据面板"
    >
      <el-input
        v-model="config.title"
        size="mini"
      />
    </g-field>
    <g-field-collapse
      :toggle="false"
      label="文本样式"
    >
      <g-field
        label="字体"
        tooltip="请选择您系统有的字体,如果您系统无此字体,标题将会显示默认字体"
        :level="2"
      >
        <el-select
          v-model="config.textStyle.fontFamily"
          size="mini"
        >
          <el-option
            v-for="item in fontFamilys"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </g-field>
      <g-field
        label="字号"
        :level="2"
      >
        <g-input-number
          v-model="config.textStyle.fontSize"
          :min="10"
          :max="100"
          :step="1"
          :is-inline="false"
        />
      </g-field>
      <g-field
        label="颜色"
        :level="2"
      >
        <el-input
          v-model="config.textStyle.color"
          size="mini"
        />
      </g-field>
      <g-field
        label="字体粗细"
        :level="2"
      >
        <el-select
          v-model="config.textStyle.fontWeight"
          size="mini"
        >
          <el-option
            v-for="item in fontWeights"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </g-field>
    </g-field-collapse>
    <g-field
      label="对齐方式"
    >
      <el-select
        v-model="config.textAlign"
        size="mini"
      >
        <el-option
          v-for="item in justifyContents"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </g-field>
    <g-field
      label="文字排列方式"
    >
      <el-select
        v-model="config.writingMode"
        size="mini"
      >
        <el-option
          v-for="item in writingModes"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </g-field>
    <g-field
      label="文字间隔"
    >
      <g-input-number
        v-model="config.letterSpacing"
        :min="-100"
        :max="100"
        :step="0.5"
        :is-inline="false"
      />
    </g-field>
    <g-field-collapse
      v-model="config.backgroundStyle.show"
      :toggle="true"
      label="背景样式"
    >
      <g-field
        label="背景色"
        :level="2"
      >
        <el-input
          v-model="config.backgroundStyle.bgColor"
          size="mini"
        />
      </g-field>
      <g-field
        label="圆角"
        :level="2"
      >
        <g-input-number
          v-model="config.backgroundStyle.borderRadius"
          :min="0"
          :max="8888"
          :step="1"
          :is-inline="false"
        />
      </g-field>
      <g-field
        label="边框颜色"
        :level="2"
      >
        <el-input
          v-model="config.backgroundStyle.borderColor"
          size="mini"
        />
      </g-field>
      <g-field
        label="边框样式"
        :level="2"
      >
        <el-input
          v-model="config.backgroundStyle.borderStyle"
          size="mini"
        />
      </g-field>
      <g-field
        label="边框粗细"
        :level="2"
      >
        <g-input-number
          v-model="config.backgroundStyle.borderWidth"
          :min="0"
          :max="8888"
          :step="1"
          :is-inline="false"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      label="省略号"
      tooltip="溢出文本加省略号"
    >
      <el-switch
        v-model="config.ellipsis"
      />
    </g-field>
    <g-field-collapse
      :toggle="false"
      label="超链接配置"
      tooltip="点击标题区域可跳转至设定的超链接"
    >
      <g-field
        label="超链接"
        :level="2"
      >
        <el-input
          v-model="config.urlConfig.url"
          size="mini"
        />
      </g-field>
      <g-field
        label="是否新开窗口"
        :level="2"
      >
        <el-switch
          v-model="config.urlConfig.isBlank"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  fontFamilys,
  fontWeights,
  writingModes,
  justifyContents,
} from '@/data/select-options'
import { MainTitle } from './main-title'

export default defineComponent({
  name: 'VMainTitleProp',
  props: {
    com: {
      type: Object as PropType<MainTitle>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

      fontFamilys,
      fontWeights,
      writingModes,
      justifyContents,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';
</style>
