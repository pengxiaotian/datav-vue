<template>
  <div class="setting-panel-gui">
    <g-field
      tooltip="当应用渐变边框或图片边框时，圆角失效"
      label="圆角"
    >
      <g-input-number
        v-model="config.borderRadius"
        :min="0"
        :step="1"
        suffix="px"
      />
    </g-field>
    <g-field-collapse
      label="填充"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
      :list="config.fills"
      :min="0"
      :max="5"
      tab="填充"
      :add-item="handleAddFillsItem"
    >
      <template #default="slotProps">
        <g-field
          label="填充"
          tooltip=""
          :level="2"
          :is-flat="true"
        >
          <g-color-picker
            v-model="slotProps.item.fill"
            inline="inline"
            label="填充"
          />
          <g-input-number
            v-model="slotProps.item.opacity"
            :min="0"
            :max="100"
            :step="1"
            suffix="%"
            inline="inline"
            label="透明度"
          />
        </g-field>
      </template>
    </g-field-collapse>
    <g-field-collapse
      v-model="config.border.show"
      :toggle="true"
      label="边框"
    >
      <g-field
        :level="2"
        label="边框类型"
      >
        <n-radio-group
          v-model:value="config.border.type"
          size="small"
        >
          <n-radio-button
            v-for="pair in [
              { key: 'flat', value: '纯色' },
              { key: 'linearGradient', value: '渐变' },
              { key: 'image', value: '图片' },
            ]"
            :key="pair.key"
            :value="pair.key"
          >
            {{ pair.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field
        v-if="config.border.type === 'flat'"
        :level="2"
        label="边框配置"
        :is-flat="true"
      >
        <g-input-number
          v-model="config.border.flat.width"
          :min="0"
          :max="100"
          :step="1"
          suffix="px"
          inline="inline"
          label="粗细"
        />
        <g-select
          v-model="config.border.flat.style"
          :data="lineStyles"
          inline="inline"
          label="样式"
        />
        <g-color-picker
          v-model="config.border.flat.color"
          inline="inline-single"
          label="颜色"
        />
      </g-field>
      <g-field-collapse
        v-if="config.border.type === 'linearGradient'"
        label="边框配置"
      >
        <g-field
          :level="2"
          label="粗细"
        >
          <g-input-number
            v-model="config.border.linearGradient.width"
            :min="0"
            :max="100"
            :step="1"
            suffix="px"
          />
        </g-field>
        <g-field-collapse
          label="渐变色"
        >
          <g-field
            :level="2"
            label="角度"
          >
            <g-input-number
              v-model="config.border.linearGradient.color.angle"
              :min="0"
              :max="360"
              :step="1"
              suffix="deg"
            />
          </g-field>
          <g-field-collapse
            label="节点"
            mode="layout"
            default-layout="horizontal"
            :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
            :list="config.border.linearGradient.color.stops"
            :min="0"
            :max="100"
            tab="节点"
            :add-item="handleAddStopsItem"
          >
            <template #default="slotProps">
              <g-field
                label="节点"
                tooltip=""
                :level="2"
                :is-flat="true"
              >
                <g-input-number
                  v-model="slotProps.item.offset"
                  :min="0"
                  :max="100"
                  :step="1"
                  inline="inline"
                  label="位置"
                />
                <g-color-picker
                  v-model="slotProps.item.color"
                  inline="inline"
                  label="颜色"
                />
              </g-field>
            </template>
          </g-field-collapse>
        </g-field-collapse>
      </g-field-collapse>
      <g-field
        v-if="config.border.type === 'image'"
        :level="2"
        label="配置方式"
      >
        <n-radio-group
          v-model:value="config.border.imageType"
          size="small"
        >
          <n-radio-button
            v-for="pair in [
              { key: 'preset', value: '预设边框' },
              { key: 'custom', value: '自定义边框' },
            ]"
            :key="pair.key"
            :value="pair.key"
          >
            {{ pair.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field
        v-if="config.border.type === 'image' && config.border.imageType === 'preset'"
        :level="2"
        label="边框配置"
      >
        <g-select-image
          v-model="config.border.presetImage"
          :images="presetImages"
        />
      </g-field>
      <g-field
        v-if="config.border.type === 'image' && config.border.imageType === 'custom'"
        :level="2"
        label="边框配置"
        :is-flat="true"
      >
        <g-upload-image
          v-model="config.border.customImage.source"
          inline="inline"
          label="图片"
        />
        <g-input
          v-model="config.border.customImage.slice"
          inline="inline"
          label="切片"
        />
        <g-input
          v-model="config.border.customImage.width"
          inline="inline"
          label="宽度"
        />
        <g-input
          v-model="config.border.customImage.outset"
          inline="inline"
          label="外扩"
        />
        <g-select
          v-model="config.border.customImage.repeat"
          :data="repeatTypes"
          inline="inline"
          label="平铺类型"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="滤镜"
    >
      <g-field
        :level="2"
        label="模糊"
      >
        <g-input
          v-model="config.filter.blur"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="背景过滤器"
    >
      <g-field
        :level="2"
        label="磨玻璃模糊"
      >
        <g-input
          v-model="config.backdropFilter.blur"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      tooltip="点击图片区域可跳转至设定的超链接"
      label="超链接配置"
    >
      <g-field
        :level="2"
        label="超链接"
      >
        <g-input
          v-model="config.urlConfig.url"
        />
      </g-field>
      <g-field
        :level="2"
        label="是否新打开窗口"
      >
        <n-switch
          v-model:value="config.urlConfig.ifBlank"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  lineStyles,
  repeatTypes,
} from '@/data/select-options'
import { BgBox, presetImages } from './bg-box'

export default defineComponent({
  name: 'VBgBoxProp',
  props: {
    com: {
      type: Object as PropType<BgBox>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const handleAddFillsItem = () => {
      return {
        fill: '#333',
        opacity: 10,
      }
    }

    const handleAddStopsItem = () => {
      return {
        offset: 0,
        color: '#f60',
      }
    }

    return {
      config,

      lineStyles,
      repeatTypes,
      presetImages,
      handleAddFillsItem,
      handleAddStopsItem,
    }
  },
})
</script>
