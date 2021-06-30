<template>
  <el-drawer
    v-model="visible"
    custom-class="source-drawer"
    size="500px"
  >
    <template #title>
      <p class="source-drawer-title">设置数据源</p>
    </template>
    <template v-if="visible">
      <div class="step-title" :class="{ '--error': !!dataStatus.errSource }">
        数据源
      </div>
      <div class="datasource-selector">
        <label class="datasource-selector-title">数据源类型</label>
        <div class="datasource-select">
          <div class="datav-new-select-wp">
            <el-select
              v-model="apiDataConfig.type"
              size="mini"
              filterable
              class="datav-new-select"
              popper-class="datav-new-select-option"
              @change="changeSource"
            >
              <el-option
                v-for="(v, k) in datasources"
                :key="k"
                :label="v"
                :value="k"
              />
            </el-select>
          </div>
        </div>
      </div>

      <ds-static-editor v-if="apiDataConfig.type === apiType.static" />
      <ds-api-editor v-else-if="apiDataConfig.type === apiType.api" />

      <el-popover
        v-model:visible="visiblePreview"
        placement="left"
        :width="400"
        popper-class="editor-popover"
      >
        <div class="ds-preview-content">
          <g-monaco-editor
            language="json"
            :read-only="true"
            :auto-format="true"
            :height="180"
            :code="dataOrign"
          />
        </div>
        <template #reference>
          <div class="ds-response-btn">
            <i class="v-icon-search"></i>
            预览数据源返回结果
          </div>
        </template>
      </el-popover>

      <div class="step-title" :class="{ '--error': !!dataStatus.errFilter }">
        <el-checkbox
          v-model="apiDataConfig.config.useFilter"
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
          '--error': !!dataStatus.errSource || !!dataStatus.errFilter
        }"
      >
        <span>数据响应结果</span>
        <i class="el-icon-refresh refresh-btn" @click="refreshData"></i>
      </div>
      <div class="data-response">
        <g-monaco-editor
          language="json"
          :read-only="true"
          :auto-format="true"
          :code="resData"
        />
      </div>
    </template>
  </el-drawer>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, ComputedRef, provide, inject } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { loadAsyncComponent } from '@/utils/async-component'
import { createDataSources, ApiConfig, ApiDataConfig, ApiType, createApiData } from '@/components/data-source'
import { ApiModule } from '@/store/modules/api'
import { setDatavData } from '@/mixins/data-center'
import FilterConfig from '@/views/screen-editor/data-filter/filter-config.vue'
import FieldGrid from '../components/field-grid.vue'

export default defineComponent({
  name: 'SourceDrawer',
  components: {
    FilterConfig,
    FieldGrid,
    DsStaticEditor: loadAsyncComponent(() => import('./api-editors/ds-static-editor.vue')),
    DsApiEditor: loadAsyncComponent(() => import('./api-editors/ds-api-editor.vue')),
  },
  setup() {
    const visible = ref(false)
    const visiblePreview = ref(false)
    const apiType = ApiType
    const datasources = createDataSources()

    const open = () => {
      visible.value = true
    }

    const com = inject('com') as ComputedRef<DatavComponent>
    const apiConfig = inject('apiConfig') as ComputedRef<ApiConfig>
    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>
    const apiName = inject('apiName') as string

    const dataStatus = computed(() => {
      const data = ApiModule.dataStatusMap[com.value.id]
      return data ? data[apiName] : {}
    })

    const dataOrign = computed(() => {
      const comData = ApiModule.originMap[com.value.id]
      return comData ? comData[apiName] : ''
    })

    const changeSource = (val: ApiType) => {
      switch (val) {
        case ApiType.api:
          {
            if (apiDataConfig.value.config.api === undefined) {
              apiDataConfig.value.config = {
                ...apiDataConfig.value.config,
                ...createApiData(),
              }
            }
          }
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
