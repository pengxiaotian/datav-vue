<template>
  <el-collapse class="pc-collapse collapse-arrow-left">
    <el-collapse-item
      v-for="item in configs"
      :key="item.key"
      :title="item.path"
      :name="item.key"
      :disabled="toggleCol === item.key"
    >
      <el-form label-width="150px">
        <el-form-item label="名称">
          <el-input v-model="item.config.alias" />
        </el-form-item>
        <template v-if="item.children">
          <el-form-item label="控制显示的属性名">
            <el-select v-model="item.config.toggleCol" :clearable="true">
              <el-option
                v-for="c in item.cols"
                :key="c"
                :value="c"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="组件类型">
            <el-select v-model="item.config.component">
              <el-option
                v-for="ct in componentTypes"
                :key="ct"
                :value="ct"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="组件预览">
            <prop-component
              :data-type="item.config.type"
              :component-type="item.config.component"
              :default-value="item.config.defaultValue"
            />
          </el-form-item>
          <template v-if="item.config.component === componentTypes.number || item.config.component === componentTypes.slider">
            <el-form-item label="最小值">
              <el-input-number v-model="item.config.min" />
            </el-form-item>
            <el-form-item label="最大值">
              <el-input-number v-model="item.config.max" />
            </el-form-item>
            <el-form-item label="步长">
              <el-input-number v-model="item.config.step" />
            </el-form-item>
          </template>
        </template>
        <el-form-item label="显示模式">
          <el-select v-model="item.config.displayMode">
            <el-option
              v-for="dm in displayModes"
              :key="dm"
              :value="dm"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提示">
          <!-- <el-input v-model="item.config.tip" /> -->
          <el-autocomplete
            v-model="item.config.tip"
            :fetch-suggestions="querySearch"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>

      <props-config-form
        v-if="item.children"
        :configs="item.children"
        :toggle-col="item.config.toggleCol"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import { PropDto, ComponentType, DisplayMode } from '@/domains/dev/prop-config'
import PropComponent from './prop-component.vue'

export default defineComponent({
  name: 'PropsConfigForm',
  components: {
    PropComponent,
  },
  props: {
    configs: {
      type: Array as PropType<PropDto[]>,
      required: true,
    },
    toggleCol: String,
  },
  setup() {
    const componentTypes = ref({ ...ComponentType })
    const displayModes = ref({ ...DisplayMode })
    const querySearch = (queryString: string, cb: Function) => {
      const results = [
        '请选择您系统有的字体,如果您系统无此字体,标题将会显示默认字体',
        '支持从数据中获取标题内容,详见数据面板',
        '分隔符最长一位，超出一位取第一位，无法以数字为分隔符',
        '当传入数据不变时始终开启动画',
      ].map(value => ({ value }))
      cb(results)
    }

    return {
      componentTypes,
      displayModes,
      querySearch,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

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
