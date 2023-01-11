<template>
  <n-collapse class="pc-collapse">
    <template #arrow>
      <n-icon>
        <IconArrowRight />
      </n-icon>
    </template>
    <n-collapse-item
      v-for="item in config"
      :key="item.key"
      :title="item.path"
      :name="item.key"
      :disabled="toggleCol === item.key"
    >
      <n-form
        label-placement="left"
        label-width="150"
      >
        <n-form-item label="名称">
          <n-input v-model:value="item.config.alias" />
        </n-form-item>
        <n-form-item label="显示模式">
          <n-select v-model:value="item.config.displayMode" :options="displayModes" />
        </n-form-item>
        <n-form-item>
          <template #label>
            <n-tooltip>
              <template #trigger>
                <label class="g-field-title-with-description">
                  区间范围
                </label>
              </template>
              如果需要用到slider-range组件
            </n-tooltip>
          </template>
          <n-checkbox v-model:checked="item.config.isRange" />
        </n-form-item>
        <template v-if="item.children && !item.config.isRange">
          <n-form-item label="控制显示的属性名">
            <n-select
              v-model:value="item.config.toggleCol"
              :options="arrToOpts(item.cols)"
              :fallback-option="false"
              clearable
            />
          </n-form-item>
        </template>
        <template v-else>
          <n-form-item label="组件类型">
            <n-select
              v-model:value="item.config.component"
              :options="componentTypes"
              filterable
            />
          </n-form-item>
          <n-form-item label="组件预览">
            <config-form-item
              :key="item.config.component"
              :data-type="item.config.type"
              :component-type="item.config.component"
              :default-value="item.config.defaultValue"
              :enums="item.config.enums"
              :pairs="item.config.pairs"
              :flat-value="item.config.flatValue"
            />
          </n-form-item>
          <n-form-item>
            <template #label>
              <n-tooltip>
                <template #trigger>
                  <label class="g-field-title-with-description">
                    是否平铺值
                  </label>
                </template>
                只在组件是 select 系列时生效
              </n-tooltip>
            </template>
            <n-checkbox v-model:checked="item.config.flatValue" />
          </n-form-item>
          <template v-if="item.config.component === ComponentType.number || item.config.component === ComponentType.slider || item.config.component === ComponentType.sliderRange">
            <n-form-item label="最小值">
              <n-space align="center">
                <g-input-number v-model="item.config.min" size="medium" />
                <n-checkbox v-model:checked="item.config.InfiniteMin">
                  不限制
                </n-checkbox>
              </n-space>
            </n-form-item>
            <n-form-item label="最大值">
              <n-space align="center">
                <g-input-number v-model="item.config.max" size="medium" />
                <n-checkbox v-model:checked="item.config.InfiniteMax">
                  不限制
                </n-checkbox>
              </n-space>
            </n-form-item>
            <n-form-item label="步长">
              <g-input-number v-model="item.config.step" size="medium" />
            </n-form-item>
            <n-form-item label="单位">
              <n-input v-model:value="item.config.suffix" />
            </n-form-item>
          </template>
          <template v-else-if="item.config.component === ComponentType.radio || item.config.component === ComponentType.radioBase || item.config.component === ComponentType.select">
            <n-form-item label="枚举值">
              <n-dynamic-input
                v-model:value="item.config.pairs"
                preset="pair"
                key-placeholder="key"
                value-placeholder="label"
              />
            </n-form-item>
          </template>
          <template v-else-if="item.config.component === ComponentType.selectSuggest">
            <n-form-item label="建议值">
              <n-select
                v-model:value="item.config.enums"
                filterable
                multiple
                clearable
                tag
                :options="selectSuggests"
              />
            </n-form-item>
          </template>
        </template>
        <n-form-item :show-feedback="false">
          <template #label>
            <n-tooltip>
              <template #trigger>
                <label class="g-field-title-with-description">
                  条件显示
                </label>
              </template>
              复杂逻辑分支判断请在生成的模板代码自行添加
            </n-tooltip>
          </template>
          <n-grid :cols="2" :x-gap="24">
            <n-form-item-gi>
              <n-select
                v-model:value="item.config.whichEnum.field"
                :options="arrToOpts(fields)"
                :fallback-option="false"
                clearable
                placeholder="枚举字段"
              />
            </n-form-item-gi>
            <n-form-item-gi>
              <n-select
                v-model:value="item.config.whichEnum.value"
                :options="arrToOpts(getEnums(item.config.whichEnum.field))"
                :fallback-option="false"
                clearable
                placeholder="枚举值"
              />
            </n-form-item-gi>
          </n-grid>
        </n-form-item>
        <template v-if="item.config.displayMode == 'nest-array'">
          <n-form-item label="工具栏">
            <n-select
              v-model:value="item.config.features"
              :options="toolboxTypes"
              multiple
              :fallback-option="false"
            />
          </n-form-item>
          <n-form-item label="最小项数">
            <g-input-number v-model="item.config.min" size="medium" />
          </n-form-item>
          <n-form-item label="最大项数">
            <g-input-number v-model="item.config.max" size="medium" />
          </n-form-item>
          <n-form-item label="默认布局">
            <n-radio-group v-model:value="item.config.layout" name="layout">
              <n-space>
                <n-radio :value="ToolboxType.horizontal">
                  水平
                </n-radio>
                <n-radio :value="ToolboxType.vertical">
                  垂直
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
        </template>
        <n-form-item label="提示">
          <n-select
            v-model:value="item.config.tip"
            filterable
            clearable
            tag
            :options="querys"
          />
        </n-form-item>
        <n-form-item label="隐藏不显示">
          <n-checkbox v-model:checked="item.config.isHide" />
        </n-form-item>
      </n-form>

      <config-form
        v-if="item.children && !item.config.isRange"
        :config="item.children"
        :toggle-col="item.config.toggleCol"
      />
    </n-collapse-item>
  </n-collapse>
</template>

<script lang='ts' setup>
import { NCollapse, NCollapseItem, NIcon, NSpace, NForm, NFormItem, NFormItemGi, NGrid, NTooltip, NInput, NSelect, NCheckbox, NDynamicInput, NRadio, NRadioGroup } from 'naive-ui'
import { GInputNumber } from '~~/ui-components'
import { IconArrowRight } from '@/icons'
import { ToolboxType } from '@/domains/editor'
import { selectSuggests } from '@/data/select-options'
import { PropDto, DisplayMode, PropDataType, ComponentType, getSelectedOptions } from '~~/domains/prop-data'

const objectToOpts = (obj: Object) => {
  return Object.values(obj).map(m => ({ value: m, label: m }))
}

const arrToOpts = (arr: string[]) => {
  return arr?.map(m => ({ value: m, label: m }))
}

const props = defineProps<{
  config: PropDto[]
  toggleCol?: String
}>()

const componentTypes = objectToOpts(ComponentType)
const displayModes = objectToOpts(DisplayMode)
const toolboxTypes = objectToOpts(ToolboxType)

const fields = computed(() => {
  return props.config.map(m => m.key)
})

const querys = [
  '请选择您系统有的字体，如果您系统无此字体，标题将会显示默认字体',
  '支持从数据中获取标题内容，详见数据面板',
  '分隔符最长一位，超出一位取第一位，无法以数字为分隔符',
  '当传入数据不变时始终开启动画',
  '溢出文本加省略号',
  '点击标题区域可跳转至设定的超链接',
  '不设时自适应，可以是绝对值例如 40 或者百分数例如 40%。',
  '默认会采用标签不重叠的策略间隔显示标签，可以设置成 0 强制显示所有标签。',
  '这是个预估值，实际显示会做调整，可以设置成 0 强制显示所有标签。',
  '整数参照 d, 浮点参照 .1f',
  '时间请参照 YYYY/MM/DD HH:mm:ss',
].map(m => ({ value: m, label: m }))

const getEnums = (field: string) => {
  if (field) {
    const config = props.config.find(m => m.key === field)
    if (config) {
      if (config.config.component === ComponentType.radio
       || config.config.component === ComponentType.radioBase
       || config.config.component === ComponentType.select
      ) {
        return config.config.pairs.map(m => m.key)
      } else if (config.config.type === PropDataType.boolean) {
        return ['true', 'false']
      } else {
        return getSelectedOptions(config.config.component).map(m => m.id)
      }
    }
  }
  return []
}
</script>

<style lang="scss">
.pc-collapse {
  --datav-gui-cp-title-padding-left: 10px;
  --datav-gui-cp-border: var(--datav-border);

  background: var(--datav-nav-bg-active);

  .n-collapse-item__content-inner {
    padding: 12px !important;
  }

  .g-field-title-with-description {
    font-size: 14px;
    color: var(--datav-gui-font-color-base);
  }

  .n-select .n-tag {
    background: var(--datav-dark-color);
  }
}
</style>
