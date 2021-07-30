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
                <el-option value=".ts&.json" />
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
          <el-card
            :body-style="{
              height: 'calc(100vh - 4px)',
            }"
          >
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
import { MessageUtil } from '@/utils/message-util'
import { pascalCase } from '@/utils/util'
import Handlebars from 'handlebars'
import '@/pages/templates/register'
import { DatavComponent } from '@/components/datav-component'
import { PropDto, ComponentType, initPropData, mixinPropData, getUsedSelectOptions } from './config'
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
    const classPath = ref('bar/basic-bar')
    const activeTab = ref('config')
    const loading = ref(false)
    const fileName = ref('')
    const ext = ref<'.ts' | '.json' | '.ts&.json'>('.ts')

    const list = ref<PropDto[]>([])
    const configCode = ref('{}')
    const templateCode = ref('<template></template>')

    const getConfigByTS = async (comName: string) => {
      const path = `${classPath.value}/src/${comName}`
      const comModule = await import(`../../components/${path}.ts`)
      const arr: PropDto[] = []
      if (comModule.default.prototype instanceof DatavComponent) {
        const dvc = new comModule.default()
        initPropData(dvc.config, arr, '')
        return arr
      } else {
        throw new Error(`未识别的模块`)
      }
    }

    const getConfigByJson = async () => {
      const path = `${classPath.value}/src/config`
      const comModule = await import(`../../components/${path}.json`)
      return comModule.default as PropDto[]
    }

    const getConfigByMixin = async (comName: string) => {
      const tsList = await getConfigByTS(comName)
      const jsonList = await getConfigByJson()
      mixinPropData(tsList, jsonList)
      return tsList
    }

    const loadModule = async () => {
      try {
        if (classPath.value) {
          loading.value = true
          const name = classPath.value.split('/').pop()
          fileName.value = name
          if (ext.value === '.ts') {
            list.value = await getConfigByTS(name)
          } else if (ext.value === '.json') {
            list.value = await getConfigByJson()
          } else if (ext.value === '.ts&.json') {
            list.value = await getConfigByMixin(name)
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
        selectOpts: getUsedSelectOptions(list.value),
      }

      try {
        loading.value = true
        templateCode.value = Handlebars.compile(configTpl)(data)
        activeTab.value = 'template'
      } catch (error) {
        console.log(error)
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
