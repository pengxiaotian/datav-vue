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
      <div class="step-title">数据源</div>
      <div class="datasource-selector">
        <label class="datasource-selector-title">数据源类型</label>
        <div class="datasource-select-wp">
          <el-select
            v-model="apiDataConfig.type"
            size="mini"
            class="datasource-select"
            popper-class="datasource-select-option"
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
      <div v-if="apiDataConfig.type === apiType.static" class="ds-wrapper ds-static">
        <g-monaco-editor
          :key="apiType.static"
          language="json"
          :code="apiDataConfig.config.data"
          @blur="updateData"
        />
      </div>
      <div v-else-if="apiDataConfig.type === apiType.api" class="ds-wrapper ds-api">
        <g-monaco-editor
          :key="apiType.api"
          language="plaintext"
          :code="apiDataConfig.config.api"
          @blur="updateData"
        />
      </div>
      <div class="step-title">
        <el-checkbox
          v-model="apiConfig.useAutoUpdate"
          class="use-filter-btn"
        />
        <span class="use-filter-text">数据过滤器</span>
        <span class="tutorial-popup">教程</span>
      </div>
      <field-grid :fields="apiConfig.fields" />
      <div class="step-title">
        <span>数据响应结果</span>
        <i class="el-icon-refresh refresh-btn"></i>
      </div>
      <div class="data-response">
        <g-monaco-editor
          language="json"
          :read-only="true"
          :code="resData"
        />
      </div>
    </template>
  </el-drawer>
</template>

<script lang='ts'>
import { defineComponent, ref, ComputedRef, inject, computed } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { ApiType } from '@/utils/enums/data-source'
import { createDataSources, ApiConfig, ApiDataConfig } from '@/components/data-source'
import { ApiModule } from '@/store/modules/api'
import FieldGrid from '../components/field-grid.vue'

export default defineComponent({
  name: 'SourceDrawer',
  components: {
    FieldGrid,
  },
  setup() {
    const visible = ref(false)
    const apiType = ApiType
    const datasources = createDataSources()

    const open = () => {
      visible.value = true
    }

    const com = inject('com') as ComputedRef<DatavComponent>
    const apiConfig = inject('apiConfig') as ComputedRef<ApiConfig>
    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>
    const apiName = inject('apiName') as string

    const changeSource = (val: string) => {
      if (val !== apiType.static && apiDataConfig.value.config[val] === undefined) {
        apiDataConfig.value.config[val] = ''
      }
    }

    const updateData = (data: any) => {
      switch (apiDataConfig.value.type) {
        case apiType.static:
          apiDataConfig.value.config.data = data.value
          break
        case apiType.api:
          apiDataConfig.value.config.api = data.value
          break
        default:
          break
      }
    }

    const resData = computed(() => {
      const data = ApiModule.dataMap[com.value.id]
      return data ? data[apiName] : ''
    })

    return {
      visible,
      apiType,
      datasources,
      com,
      apiConfig,
      apiDataConfig,
      resData,
      open,
      changeSource,
      updateData,
    }
  },
})
</script>

<style lang="scss">
@import './source-drawer.scss';
</style>
