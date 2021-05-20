<template>
  <el-collapse class="pc-collapse collapse-arrow-left">
    <el-collapse-item
      v-for="item in configs"
      :key="item.key"
      :title="item.path"
      :name="item.key"
    >
      <el-form label-width="150px">
        <el-form-item label="名称">
          <el-input v-model="item.config.alias" />
        </el-form-item>
        <template v-if="item.children">
          <el-form-item label="控制显示的属性名">
            <el-select v-model="item.config.showCol">
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
          <el-input v-model="item.config.tip" />
        </el-form-item>
      </el-form>

      <props-config-form
        v-if="item.children"
        :configs="item.children"
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
  },
  setup() {
    const componentTypes = ref({ ...ComponentType })
    const displayModes = ref({ ...DisplayMode })

    return {
      componentTypes,
      displayModes,
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
