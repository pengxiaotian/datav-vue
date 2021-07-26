<template>
  <el-collapse class="pc-collapse collapse-arrow-left">
    <el-collapse-item
      v-for="item in config"
      :key="item.key"
      :title="item.path"
      :name="item.key"
      :disabled="toggleCol === item.key"
    >
      <el-form label-width="150px">
        <el-form-item label="名称" label-width="150px">
          <el-input v-model="item.config.alias" />
        </el-form-item>
        <el-form-item label="显示模式" label-width="150px">
          <el-select v-model="item.config.displayMode">
            <el-option
              v-for="dm in displayModes"
              :key="dm"
              :value="dm"
            />
          </el-select>
        </el-form-item>
        <template v-if="item.children">
          <el-form-item label="控制显示的属性名" label-width="150px">
            <el-select v-model="item.config.toggleCol" clearable>
              <el-option
                v-for="c in item.cols"
                :key="c"
                :value="c"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="组件类型" label-width="150px">
            <el-select v-model="item.config.component">
              <el-option
                v-for="ct in componentTypes"
                :key="ct"
                :value="ct"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="组件预览" label-width="150px">
            <config-form-item
              :data-type="item.config.type"
              :component-type="item.config.component"
              :default-value="item.config.defaultValue"
              :enums="item.config.enums"
            />
          </el-form-item>
          <template v-if="item.config.component === componentTypes.number || item.config.component === componentTypes.slider">
            <el-form-item label="最小值" label-width="150px">
              <el-input-number v-model="item.config.min" />
            </el-form-item>
            <el-form-item label="最大值" label-width="150px">
              <el-input-number v-model="item.config.max" />
            </el-form-item>
            <el-form-item label="步长" label-width="150px">
              <el-input-number v-model="item.config.step" />
            </el-form-item>
          </template>
          <template v-if="item.config.component === componentTypes.number">
            <el-form-item label="单位" label-width="150px">
              <el-input v-model="item.config.suffix" />
            </el-form-item>
          </template>
          <template v-if="item.config.component === componentTypes.radio">
            <el-form-item label="枚举值" label-width="150px">
              <el-select
                v-model="item.config.enums"
                multiple
                filterable
                allow-create
                default-first-option
              />
            </el-form-item>
          </template>
        </template>
        <el-form-item v-if="hasRadio" label-width="150px">
          <template #label>
            <el-tooltip
              effect="blue"
              placement="top"
              :offset="2"
              content="复杂逻辑分支判断请在生成的模板代码自行添加"
            >
              <label class="g-field-title-with-description" style="color: #a1aeb3;">
                条件显示
              </label>
            </el-tooltip>
          </template>
          <el-row>
            <el-col :span="11">
              <el-select
                v-model="item.config.whichEnum.field"
                clearable
                placeholder="枚举字段"
              >
                <el-option
                  v-for="f in fields"
                  :key="f"
                  :value="f"
                />
              </el-select>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-select
                v-model="item.config.whichEnum.value"
                clearable
                placeholder="枚举值"
              >
                <el-option
                  v-for="em in getEnums(item.config.whichEnum.field)"
                  :key="em"
                  :value="em"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <template v-if="item.config.displayMode == 'nest-array'">
          <el-form-item label="工具栏" label-width="150px">
            <el-select v-model="item.config.features" multiple>
              <el-option
                v-for="tt in toolboxTypes"
                :key="tt"
                :value="tt"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最小项数" label-width="150px">
            <el-input-number v-model="item.config.min" />
          </el-form-item>
          <el-form-item label="最大项数" label-width="150px">
            <el-input-number v-model="item.config.max" />
          </el-form-item>
          <el-form-item label="默认布局" label-width="150px">
            <el-select v-model="item.config.layout">
              <el-option
                v-for="tt in [toolboxTypes.horizontal, toolboxTypes.vertical]"
                :key="tt"
                :value="tt"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="提示" label-width="150px">
          <el-autocomplete
            v-model="item.config.tip"
            :fetch-suggestions="querySearch"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="隐藏不显示" label-width="150px">
          <el-checkbox v-model="item.config.isHide" />
        </el-form-item>
      </el-form>

      <config-form
        v-if="item.children"
        :config="item.children"
        :toggle-col="item.config.toggleCol"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, computed } from 'vue'
import { PropDto, ComponentType, DisplayMode } from '@/domains/dev/prop-config'
import { ToolboxType } from '@/utils/enums'
import ConfigFormItem from './config-form-item.vue'

export default defineComponent({
  name: 'ConfigForm',
  components: {
    ConfigFormItem,
  },
  props: {
    config: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
    toggleCol: String,
  },
  setup(props) {
    const componentTypes = ref({ ...ComponentType })
    const displayModes = ref({ ...DisplayMode })
    const toolboxTypes = ref({ ...ToolboxType })

    const fields = computed(() => {
      return props.config.map(m => m.key)
    })

    const hasRadio = computed(() => {
      return props.config.some(m => m.config.component === 'radio')
    })

    const querySearch = (queryString: string, cb: Function) => {
      const results = [
        '请选择您系统有的字体，如果您系统无此字体，标题将会显示默认字体',
        '支持从数据中获取标题内容，详见数据面板',
        '分隔符最长一位，超出一位取第一位，无法以数字为分隔符',
        '当传入数据不变时始终开启动画',
        '溢出文本加省略号',
        '点击标题区域可跳转至设定的超链接',
      ].map(value => ({ value }))
      cb(results)
    }

    const getEnums = (field: string) => {
      const config = props.config.find(m => m.key === field)
      return config ? config.config.enums : []
    }

    return {
      componentTypes,
      displayModes,
      toolboxTypes,
      fields,
      hasRadio,
      querySearch,
      getEnums,
    }
  },
})
</script>

<style lang="scss">
@import '@/styles/themes/var';

.pc-collapse {
  .el-collapse-item__header {
    padding-left: 16px;
    border-bottom: 1px solid #3a4659;
  }

  .el-collapse-item__content {
    padding: 12px;
  }
}
</style>
