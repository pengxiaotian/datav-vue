<template>
  <el-container>
    <el-header class="pc-header">
      <el-input size="large" placeholder="输入组件目录" />
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="12">
          <el-collapse class="pc-collapse">
            <el-collapse-item
              v-for="item in list"
              :key="item.key"
              :title="item.path"
              :name="item.key"
            >
              <el-form label-width="150px">
                <el-form-item label="名称">
                  <el-input v-model="item.config.alias" />
                </el-form-item>
                <el-form-item label="组件类型">
                  <el-select v-model="item.config.component">
                    <el-option
                      v-for="ct in componentTypes"
                      :key="ct"
                      :label="ct"
                      :value="ct"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="默认值">
                  <PropComponent
                    :data-type="item.config.type"
                    :component-type="item.config.component"
                    @change="(v) => item.config.defaultValue = v"
                  />
                </el-form-item>
                <el-form-item label="控制显示的属性名">
                  <el-select v-model="item.config.showCol">
                    <el-option
                      v-for="c in item.cols"
                      :key="c"
                      :label="c"
                      :value="c"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="显示模式">
                  <el-select v-model="item.config.displayMode">
                    <el-option
                      v-for="dm in displayModes"
                      :key="dm"
                      :label="dm"
                      :value="dm"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="提示">
                  <el-input v-model="item.config.tip" />
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col :span="12">
          2
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import {
  PropDto, initPropData,
  ComponentType, DisplayMode,
} from '@/domains/dev/prop-config'
import MainTitle from '@/components/text/main-title/src/main-title'
import PropComponent from './prop-component.vue'


export default defineComponent({
  name: 'PropsConfig',
  components: {
    PropComponent,
  },
  setup() {
    const list = ref<PropDto[]>([])
    const dvc = new MainTitle()
    initPropData(dvc.config, list.value, '')

    const componentTypes = ref({ ...ComponentType })
    const displayModes = ref({ ...DisplayMode })

    return {
      list,
      componentTypes,
      displayModes,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.pc-header {
  padding: 20px;
}

.pc-collapse {
  .el-collapse-item__header {
    padding-left: 16px;
  }

  .el-collapse-item__content {
    padding: 12px;
  }
}
</style>
