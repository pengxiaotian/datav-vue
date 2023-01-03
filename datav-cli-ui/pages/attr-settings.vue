<template>
  <n-spin :show="loading">
    <div class="g-layout is-vertical">
      <div class="g-header" style="margin-top: 20px;">
        <n-space align="center" justify="center">
          <n-input-group>
            <n-cascader
              v-model:value="comKey"
              :options="sysComs"
              show-path
              filterable
              size="large"
              placeholder="请选择组件"
              style="width: 540px;"
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
            :disabled="!comKey"
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
              <config-form :config="list" class="config-form-panel" />
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
            <n-button
              v-if="activeTab !== 'config'"
              type="success"
              secondary
              :loading="writePending"
              style="margin-top: 20px;"
              @click="writeFile"
            >
              写入 {{ activeTab === 'code' ? 'config.json' : 'config.vue' }} 文件
            </n-button>
          </n-gi>
        </n-grid>
      </div>
    </div>
  </n-spin>
</template>

<script lang="ts" setup>
import { useMessage, NSpin, NSpace, NInputGroup, NCascader, NSelect, NButton, NGrid, NGi, NCard, NTabs, NTabPane } from 'naive-ui'
import { ComponentType, initPropData, mixinPropData, PropDataType, PropDto, getUsedSelectOptions } from '~~/domains/prop-data'
import { GMonacoEditor } from '~~/ui-components'
import { getSystemDataVComponents, pascalCaseForComName } from '~~/domains/system-components'
import Handlebars from 'handlebars'
import '~~/assets/templates/register'
import { plainText as configTpl } from '~~/assets/templates/config-tpl.hbs'

const nMessage = useMessage()

const comModules = shallowRef<Record<string, () => Promise<any>>>(null)
const sysComs = getSystemDataVComponents()
const comKey = ref<string>(null)
const comTsKey = ref('')
const comJsonKey = ref('')
const activeTab = ref<'config' | 'code'| 'template'>('config')
const loading = ref(false)
const writePending = ref(false)
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

const getConfigByTS = async () => {
  const comModule = await comModules.value[comTsKey.value]()
  const arr: PropDto[] = []
  const dvc = new comModule.default()
  initPropData(dvc.config, arr, '')
  return arr
}

const getConfigByJson = async () => {
  const comModule = await comModules.value[comJsonKey.value]()
  return comModule.default as PropDto[]
}

const getConfigByMixin = async () => {
  const tsList = await getConfigByTS()
  const jsonList = await getConfigByJson()
  mixinPropData(tsList, jsonList)
  return tsList
}

const loadModule = async () => {
  try {
    loading.value = true
    if (!comModules.value) {
      comModules.value = import.meta.glob([
        '@/../src/components/**/*.{ts,json}',
        '!@/../src/components/_*/**/*',
        '!@/../src/components/ui/**/*',
        '!@/../src/components/*',
      ])
    }

    let isSubCom = false
    const paths = Object.keys(comModules.value)
    let path = paths.find(m => m.includes(`src/${comKey.value}.ts`))
    if (!path) {
      isSubCom = true
      path = paths.find(m => m.includes(`src/${comKey.value}/index.ts`))
    }

    if (!path) {
      nMessage.warning(`未找到组件: ${comKey.value}`)
      return
    }

    comName.value = comKey.value
    fileName.value = isSubCom ? 'index' : comKey.value
    comTsKey.value = path
    comJsonKey.value = path.replace(`${fileName.value}.ts`, 'config.json')
    if (ext.value === '.ts') {
      list.value = await getConfigByTS()
    } else if (ext.value === '.json') {
      list.value = await getConfigByJson()
    } else if (ext.value === '.ts&.json') {
      list.value = await getConfigByMixin()
    } else {
      throw new Error(`未识别的文件格式`)
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
    comName: pascalCaseForComName(comName.value),
    propDataTypes: { ...PropDataType },
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

const writeFile = async () => {
  try {
    if (!comJsonKey.value) {
      nMessage.warning('请选择组件')
      return
    }

    writePending.value = true
    const { data } = await useFetch('/api/update-com-config', {
      method: 'post',
      body: {
        path: activeTab.value === 'code'
          ? comJsonKey.value
          : comJsonKey.value.replace('.json', '.vue'),
        content: activeTab.value === 'code'
          ? configCode.value
          : templateCode.value,
      },
    })
    writePending.value = false
    if (data.value.code !== 0) {
      throw new Error(data.value.message)
    }

    nMessage.success('写入成功')
  } catch (error) {
    nMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.config-form-panel {
  width: 100%;
  height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
