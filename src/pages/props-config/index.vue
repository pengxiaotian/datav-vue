<template>
  <el-container>
    <el-header class="pc-header">
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <el-input size="large" placeholder="输入组件目录" style="width: 60%;" />
          <el-button size="large" style="margin-left: 12px;">确定</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header__actions">
                <span>属性配置</span>
                <el-button>生成模板代码</el-button>
              </div>
            </template>
            <props-config-form :configs="list" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <el-tabs v-model="activeTab" type="card">
              <el-tab-pane label="配置预览" name="config">
                <props-config-preview :configs="list" />
              </el-tab-pane>
              <el-tab-pane label="配置代码" name="code" lazy>
                <g-monaco-editor
                  language="json"
                  :code="list"
                  :height="500"
                  :read-only="true"
                />
              </el-tab-pane>
              <el-tab-pane label="模板代码" name="template" lazy>
                <g-monaco-editor
                  language="html"
                  code="<div></div>"
                  :height="500"
                />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { PropDto, initPropData } from '@/domains/dev/prop-config'
import MainTitle from '@/components/text/main-title/src/main-title'
import PropsConfigForm from '../components/props-config-form.vue'
import PropsConfigPreview from '../components/props-config-preview.vue'

export default defineComponent({
  name: 'PropsConfig',
  components: {
    PropsConfigForm,
    PropsConfigPreview,
  },
  setup() {
    const list = ref<PropDto[]>([])
    const dvc = new MainTitle()

    const activeTab = ref('config')

    initPropData(dvc.config, list.value, '')

    return {
      list,
      activeTab,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.pc-header {
  padding-top: 20px;
}
</style>
