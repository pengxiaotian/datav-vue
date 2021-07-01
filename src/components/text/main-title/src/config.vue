<template>
  <div class="setting-panel-gui">
    <g-field
      tooltip="支持从数据中获取标题内容，详见数据面板"
      label="标题名"
    >
      <el-input
        v-model="config.title"
        size="mini"
      />
    </g-field>
    <g-field-collapse
      label="文本样式"
    >
      <g-field
        :level="2"
        tooltip="请选择您系统有的字体,如果您系统无此字体,标题将会显示默认字体"
        label="字体"
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
        :level="2"
        label="字号"
      >
        <g-input-number
          v-model="config.textStyle.fontSize"
          :min="12"
          :max="100"
          :step="1"
          :is-inline="false"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.textStyle.color"
        />
      </g-field>
      <g-field
        :level="2"
        label="字体粗细"
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
        :min="-88888"
        :max="88888"
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
        :level="2"
        label="背景色"
      >
        <g-color-picker
          v-model="config.backgroundStyle.bgColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="圆角"
      >
        <g-input-number
          v-model="config.backgroundStyle.borderRadius"
          :min="0"
          :max="88888"
          :step="1"
          :is-inline="false"
        />
      </g-field>
      <g-field
        :level="2"
        label="边框颜色"
      >
        <g-color-picker
          v-model="config.backgroundStyle.borderColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="边框粗细"
      >
        <el-select
          v-model="config.backgroundStyle.borderStyle"
          size="mini"
        >
          <el-option
            v-for="item in lineStyles"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </g-field>
      <g-field
        :level="2"
        label="边框粗细"
      >
        <g-input-number
          v-model="config.backgroundStyle.borderWidth"
          :min="0"
          :max="88888"
          :step="1"
          :is-inline="false"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      tooltip="溢出文本加省略号"
      label="省略号"
    >
      <el-switch
        v-model="config.ellipsis"
      />
    </g-field>
    <g-field-collapse
      tooltip="点击标题区域可跳转至设定的超链接"
      label="超链接配置"
    >
      <g-field
        :level="2"
        label="超链接"
      >
        <el-input
          v-model="config.urlConfig.url"
          size="mini"
        />
      </g-field>
      <g-field
        :level="2"
        label="是否新开窗口"
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
  lineStyles,
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
      lineStyles,
    }
  },
})
</script>
