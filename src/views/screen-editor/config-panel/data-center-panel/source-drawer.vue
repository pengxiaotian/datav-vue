<template>
  <n-drawer
    v-model:show="visible"
    width="500px"
    class="source-drawer"
    to="#edit-main-wp"
  >
    <n-drawer-content closable>
      <template #header>
        <p class="source-drawer-title">设置数据源</p>
      </template>

      <div class="step-title" :class="{ '--error': !!dataStatus.api }">
        数据源
      </div>
      <div class="datasource-selector">
        <label class="datasource-selector-title">数据源类型</label>
        <div class="datasource-select">
          <div class="datav-new-select-wp">
            <n-select
              v-model:value="apiDataConfig.type"
              :options="datasources"
              filterable
              class="datav-new-select"
              :style="{
                '--border': 'var(--datav-gui-new-select-border)',
                '--color': 'var(--datav-gui-new-select-bgcolor)'
              }"
              @update:value="changeSource"
            />
          </div>
        </div>
      </div>

      <ds-static-editor v-if="apiDataConfig.type === apiType.static" />
      <ds-api-editor v-else-if="apiDataConfig.type === apiType.api" />

      <n-popover
        v-model:show="visiblePreview"
        placement="left"
        :width="400"
        class="editor-popover"
      >
        <template #trigger>
          <div class="ds-response-btn">
            <n-icon class="refresh-btn">
              <IconSearch />
            </n-icon>
            预览数据源返回结果
          </div>
        </template>
        <div class="ds-preview-content">
          <g-monaco-editor
            language="json"
            :read-only="true"
            :auto-format="true"
            :height="180"
            :code="dataOrign"
          />
        </div>
      </n-popover>

      <div class="step-title" :class="{ '--error': !!dataStatus.filter }">
        <n-checkbox
          v-model:checked="apiDataConfig.config.useFilter"
          class="use-filter-btn"
        />
        <span class="use-filter-text">数据过滤器</span>
        <span class="tutorial-popup">教程</span>
      </div>

      <filter-config />

      <field-grid :fields="apiConfig.fields" />
      <div
        class="step-title"
        :class="{
          '--error': !!dataStatus.api || !!dataStatus.filter
        }"
      >
        <span>数据响应结果</span>
        <n-icon class="refresh-btn" @click="refreshData">
          <IconRefresh />
        </n-icon>
      </div>
      <div class="data-response">
        <g-monaco-editor
          language="json"
          :read-only="true"
          :auto-format="true"
          :code="resData"
        />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, ComputedRef, provide, inject } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { loadAsyncComponent } from '@/utils/async-component'
import { createDataSources, ApiConfig, ApiDataConfig, ApiType, createDataConfigForApi } from '@/components/data-source'
import { DebugModule } from '@/store/modules/debug'
import { ApiModule } from '@/store/modules/api'
import { setDatavData } from '@/mixins/data-center'
import { IconSearch, IconRefresh } from '@/icons'
import FilterConfig from '@/views/screen-editor/data-filter/filter-config.vue'
import FieldGrid from '../components/field-grid.vue'

export default defineComponent({
  name: 'SourceDrawer',
  components: {
    FilterConfig,
    FieldGrid,
    IconSearch,
    IconRefresh,
    DsStaticEditor: loadAsyncComponent(() => import('./api-editors/ds-static-editor.vue')),
    DsApiEditor: loadAsyncComponent(() => import('./api-editors/ds-api-editor.vue')),
  },
  setup() {
    const visible = ref(false)
    const visiblePreview = ref(false)
    const apiType = ApiType
    const datasources = Object.entries(createDataSources())
      .map(([value, label]) => ({ value, label }))

    const open = () => {
      visible.value = true
    }

    const com = inject('com') as ComputedRef<DatavComponent>
    const apiConfig = inject('apiConfig') as ComputedRef<ApiConfig>
    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>
    const apiName = inject('apiName') as string

    const dataStatus = computed(() => {
      const data = DebugModule.dataStatusMap[com.value.id]
      return data ? data[apiName] ?? {} : {}
    })

    const dataOrign = computed(() => {
      const comData = DebugModule.originMap[com.value.id]
      return comData ? comData[apiName] : ''
    })

    const changeSource = (val: ApiType) => {
      switch (val) {
        case ApiType.api:
          createDataConfigForApi(apiDataConfig.value.config)
          break
        default:
          break
      }
    }

    const resData = computed(() => {
      const data = ApiModule.dataMap[com.value.id]
      return data ? data[apiName] : ''
    })

    const refreshData = async () => {
      await setDatavData(com.value.id, apiName, apiConfig.value, apiDataConfig.value)
    }

    provide('refreshData', refreshData)
    provide('dataStatus', dataStatus)

    return {
      visible,
      visiblePreview,
      apiType,
      datasources,
      com,
      apiConfig,
      apiDataConfig,
      dataStatus,
      dataOrign,
      resData,
      open,
      changeSource,
      refreshData,
    }
  },
})
</script>

<style lang="scss">
@import './source-drawer.scss';
</style>
