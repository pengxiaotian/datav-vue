<template>
  <n-spin :show="loading">
    <div class="g-layout is-vertical">
      <div class="g-header" style="margin-top: 20px;">
        <n-space align="center" justify="center">
          <n-input-group>
            <n-input-group-label size="large">
              src/components/
            </n-input-group-label>
            <n-input
              v-model:value="classPath"
              size="large"
              placeholder="输入组件目录, 如: text/main-title"
              style="width: 400px;"
            />
            <n-select
              v-model:value="ext"
              :options="extOpts"
              size="large"
              style="width: 90px;"
            />
          </n-input-group>
          <n-button
            size="large"
            :disabled="!classPath"
            style="margin-left: 12px;"
            @click="loadModule"
          >
            加载
          </n-button>
        </n-space>
      </div>
      <div class="g-main">
        <n-grid :x-gap="24" :cols="2">
          <n-gi>
            <n-card size="small" title="属性配置">
              <template #header-extra>
                <n-space>
                  <n-button @click="genConfig">生成配置代码</n-button>
                  <n-button @click="genTemplate">生成模板代码</n-button>
                </n-space>
              </template>
              <config-form :config="list" />
            </n-card>
          </n-gi>
          <n-gi>
            <n-card size="small">
              <n-tabs v-model:value="activeTab">
                <n-tab-pane tab="配置预览" name="config" display-directive="show:lazy">
                  <config-preview :config="list" />
                </n-tab-pane>
                <n-tab-pane tab="配置代码（config.json）" name="code" display-directive="show:lazy">
                  <g-monaco-editor
                    language="json"
                    :code="configCode"
                    :height="500"
                    :read-only="true"
                    :auto-format="true"
                  />
                </n-tab-pane>
                <n-tab-pane tab="模板代码（config.vue）" name="template" display-directive="show:lazy">
                  <g-monaco-editor
                    language="html"
                    :code="templateCode"
                    :height="500"
                  />
                </n-tab-pane>
              </n-tabs>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </div>
  </n-spin>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { pascalCase } from '@/utils/util'
import Handlebars from 'handlebars'
import '@/pages/templates/register'
import { DatavComponent } from '@/components/_models/datav-component'
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
    const nMessage = useMessage()
    const classPath = ref('text/main-title')
    const activeTab = ref('config')
    const loading = ref(false)
    const fileName = ref('')
    const ext = ref<'.ts' | '.json' | '.ts&.json'>('.ts')
    const extOpts = [
      { value: '.ts', label: '.ts' },
      { value: '.json', label: '.json' },
      { value: '.ts&.json', label: '.ts&.json' },
    ]

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
        nMessage.error(error.message)
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
        nMessage.error(error.message)
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
        nMessage.error(error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      classPath,
      ext,
      extOpts,
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
