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
              placeholder="输入组件目录, 如: map/china2d"
              style="width: 250px;"
            />
            <n-input
              v-model:value="classSubPath"
              size="large"
              placeholder="子组件, 如: china2d-area"
              style="width: 200px;"
            />
            <n-select
              v-model:value="ext"
              :options="extOpts"
              size="large"
              style="width: 110px;"
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

<script lang="ts" setup>
import { useMessage, NSpin, NSpace, NInputGroup, NInputGroupLabel, NInput, NSelect, NButton, NGrid, NGi, NCard, NTabs, NTabPane } from 'naive-ui'
import { pascalCase } from '@/utils/string-util'
import { ComponentType, initPropData, mixinPropData, PropDataType, PropDto, getUsedSelectOptions } from '@/domains/prop-data'
import { GMonacoEditor } from '@/ui-components'

const nMessage = useMessage()

const comModules = shallowRef<Record<string, () => Promise<any>>>(null)
const classPath = ref('table/carousel-table')
const classSubPath = ref('')
const activeTab = ref('config')
const loading = ref(false)
const fileName = ref('')
const comName = ref('')
const ext = ref<'.ts' | '.json' | '.ts&.json'>('.ts')
const extOpts = [
  { value: '.ts', label: '.ts' },
  { value: '.json', label: '.json' },
  { value: '.ts&.json', label: '.ts&.json' },
]

const list = ref<PropDto[]>([])
const configCode = ref('{}')
const templateCode = ref('<template></template>')

const getConfigByTS = async (fileName: string) => {
  let path = `${classPath.value}/src`
  if (classSubPath.value) {
    path += `/${classSubPath.value}`
  }

  const comModule = await comModules.value[`/src/components/${path}/${fileName}.ts`]()
  const arr: PropDto[] = []
  const dvc = new comModule.default()
  initPropData(dvc.config, arr, '')
  return arr
}

const getConfigByJson = async () => {
  let path = `${classPath.value}/src`
  if (classSubPath.value) {
    path += `/${classSubPath.value}`
  }
  const comModule = await comModules.value[`/src/components/${path}/config.json`]()
  return comModule.default as PropDto[]
}

const getConfigByMixin = async (fileName: string) => {
  const tsList = await getConfigByTS(fileName)
  const jsonList = await getConfigByJson()
  mixinPropData(tsList, jsonList)
  return tsList
}

const loadModule = async () => {
  try {
    if (!comModules.value) {
      comModules.value = import.meta.glob([
        '@/../src/components/**/*.{ts,json}',
        '!@/../src/components/_*/**/*',
        '!@/../src/components/ui/**/*',
        '!@/../src/components/*',
      ])
    }

    console.log(comModules.value)
    return

    if (classPath.value) {
      loading.value = true
      if (classSubPath.value) {
        fileName.value = 'index'
        comName.value = classSubPath.value.split('/').pop()
      } else {
        fileName.value = classPath.value.split('/').pop()
        comName.value = fileName.value
      }
      if (ext.value === '.ts') {
        list.value = await getConfigByTS(fileName.value)
      } else if (ext.value === '.json') {
        list.value = await getConfigByJson()
      } else if (ext.value === '.ts&.json') {
        list.value = await getConfigByMixin(fileName.value)
      } else {
        throw new Error(`未识别的文件格式`)
      }
    }
  } catch (error) {
    console.log(error)
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
    console.log(error)
    nMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const genTemplate = () => {
  const data = {
    fileName: fileName.value,
    comName: pascalCase(comName.value)
      .replace('2D', '2d')
      .replace('3D', '3d'),
    propDataTypes: { ...PropDataType },
    componentTypes: { ...ComponentType },
    configs: list.value,
    selectOpts: getUsedSelectOptions(list.value),
  }

  try {
    loading.value = true
    // templateCode.value = Handlebars.compile(configTpl)(data)
    activeTab.value = 'template'
  } catch (error) {
    console.log(error)
    nMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>
