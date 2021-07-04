<template>
  <el-container
    v-loading.fullscreen.lock="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-header class="pc-header">
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <el-input
            v-model.trim="classPath"
            size="large"
            placeholder="输入组件目录, 如: text/main-title"
            style="width: 60%;"
          >
            <template #prepend>src/components/</template>
            <template #append>
              <el-select v-model="ext" style="width: 66px;">
                <el-option value=".ts" />
                <el-option value=".json" />
              </el-select>
            </template>
          </el-input>
          <el-button
            size="large"
            :disabled="!classPath"
            style="margin-left: 12px;"
            @click="loadModule"
          >
            加载
          </el-button>
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
                <div>
                  <el-button @click="genConfig">生成配置代码</el-button>
                  <el-button @click="genTemplate">生成模板代码</el-button>
                </div>
              </div>
            </template>
            <config-form :config="list" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <el-tabs v-model="activeTab" type="card">
              <el-tab-pane label="配置预览" name="config">
                <config-preview :config="list" />
              </el-tab-pane>
              <el-tab-pane label="配置代码（config.json）" name="code" lazy>
                <div style="padding: 12px;">
                  <g-monaco-editor
                    language="json"
                    :code="configCode"
                    :height="500"
                    :read-only="true"
                    :auto-format="true"
                  />
                </div>
              </el-tab-pane>
              <el-tab-pane label="模板代码（config.vue）" name="template" lazy>
                <div style="padding: 12px;">
                  <g-monaco-editor
                    language="html"
                    :code="templateCode"
                    :height="500"
                  />
                </div>
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
import { PropDto, initPropData, ComponentType } from '@/domains/dev/prop-config'
import { MessageUtil } from '@/utils/message-util'
import { pascalCase } from '@/utils/util'
import Handlebars from 'handlebars'
import { DatavComponent } from '@/components/datav-component'
import '@/pages/templates/register'
import ConfigForm from '../components/config-form.vue'
import ConfigPreview from '../components/config-preview.vue'
import { plainText as configTpl } from '../templates/config-tpl.hbs'

export default defineComponent({
  name: 'PropsConfig',
  components: {
    ConfigForm,
    ConfigPreview,
  },
  setup() {
    const classPath = ref('')
    const activeTab = ref('config')
    const loading = ref(false)
    const fileName = ref('')
    const ext = ref<'.ts' | '.json'>('.ts')

    const list = ref<PropDto[]>([])
    const configCode = ref('{}')
    const templateCode = ref('<template></template>')

    const loadModule = async () => {
      try {
        if (classPath.value) {
          loading.value = true
          let comModule: any
          if (ext.value === '.ts') {
            const name = classPath.value.split('/').pop()
            const path = `${classPath.value}/src/${name}`
            comModule = await import(`../../components/${path}.ts`)
            if (comModule.default.prototype instanceof DatavComponent) {
              fileName.value = name
              list.value = []
              const dvc = new comModule.default()
              initPropData(dvc.config, list.value, '')
            } else {
              throw new Error(`未识别的模块`)
            }
          } else if (ext.value === '.json') {
            const path = `${classPath.value}/src/config`
            comModule = await import(`../../components/${path}.json`)
            list.value = comModule.default
          } else {
            throw new Error(`未识别的文件格式`)
          }
        }
      } catch (error) {
        MessageUtil.error(error?.toString())
      } finally {
        loading.value = false
      }
    }

    const genConfig = () => {
      try {
        loading.value = true
        configCode.value = JSON.stringify(list.value, null, 2)
        activeTab.value = 'code'
      } catch (error) {
        MessageUtil.error(error?.toString())
      } finally {
        loading.value = false
      }
    }

    const genTemplate = () => {
      const data = {
        fileName: fileName.value,
        comName: pascalCase(fileName.value),
        componentTypes: { ...ComponentType },
        configs: list.value,
      }

      try {
        loading.value = true
        templateCode.value = Handlebars.compile(configTpl)(data)
        activeTab.value = 'template'
      } catch (error) {
        MessageUtil.error(error?.toString())
      } finally {
        loading.value = false
      }
    }

    return {
      classPath,
      ext,
      activeTab,
      loading,
      list,
      configCode,
      templateCode,
      loadModule,
      genConfig,
      genTemplate,
    }
  },
})
</script>

<style lang="scss">
@import '@/styles/themes/var';

.pc-header {
  padding-top: 20px;
}
</style>
