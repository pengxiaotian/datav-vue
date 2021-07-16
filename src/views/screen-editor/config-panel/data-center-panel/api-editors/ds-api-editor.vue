<template>
  <div class="ds-wrapper ds-api">
    <p>请求方式</p>
    <div class="datav-new-select-wp">
      <el-select
        v-model="apiDataConfig.config.apiMethod"
        size="mini"
        class="datav-new-select"
        popper-class="datav-new-select-option"
      >
        <el-option
          v-for="amd in apiMethods"
          :key="amd"
          :label="amd"
          :value="amd"
        />
      </el-select>
    </div>
    <p class="url-info">
      <label class="prefix-label textarea-label">URL：</label>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
        class="api-help"
      >重要：跨域问题解决方案</a>
    </p>
    <p class="url-info-text">
      将回调参数配置到url中, 例: http://api.test?value=:value
    </p>
    <g-monaco-editor
      language="plaintext"
      line-numbers="off"
      :height="120"
      :code="apiDataConfig.config.api"
      :completions="variables"
      @blur="updateData"
    />
    <div class="post-request-data">
      <p class="url-info-text">Headers (Optional)</p>
      <g-monaco-editor
        language="json"
        :height="120"
        :auto-format="true"
        :code="apiDataConfig.config.apiHeaders"
        @blur="updateApiHeaders"
      />
    </div>
    <div v-if="apiDataConfig.config.apiMethod === apiMethods.POST" class="post-request-data">
      <p class="url-info-text">POST 请求参数</p>
      <g-monaco-editor
        language="json"
        :height="120"
        :auto-format="true"
        :code="apiDataConfig.config.apiBody"
        @blur="updateApiBody"
      />
    </div>
    <el-checkbox v-model="apiDataConfig.config.local" class="ds-checkbox">
      服务器代理请求 (因跨域无法访问时可勾选)
    </el-checkbox>
    <el-checkbox v-model="apiDataConfig.config.cookie" class="ds-checkbox">
      需要 cookie (不选择代理并且需要获取cookie时使用)
    </el-checkbox>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ComputedRef, inject } from 'vue'
import { ApiDataConfig, ApiRequestMethod } from '@/components/data-source'
import { DatavComponent } from '@/components/datav-component'
import { EditorModule } from '@/store/modules/editor'

export default defineComponent({
  name: 'DsApiEditor',
  setup() {
    const com = inject('com') as ComputedRef<DatavComponent>
    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>
    const apiMethods = ApiRequestMethod

    const variables = Object.keys(EditorModule.pageConfig.variables.publishersView)

    const updateData = (data: any) => {
      apiDataConfig.value.config.api = data.value
      EditorModule.setSubscribersView({
        id: com.value.id,
        data: data.value,
      })
    }

    const updateApiHeaders = (data: any) => {
      apiDataConfig.value.config.apiHeaders = data.value
    }

    const updateApiBody = (data: any) => {
      apiDataConfig.value.config.apiBody = data.value
    }

    return {
      apiDataConfig,
      apiMethods,
      variables,
      updateData,
      updateApiHeaders,
      updateApiBody,
    }
  },
})
</script>

<style lang="scss">
@import '@/styles/themes/var';

.ds-api {
  .url-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .api-help {
      color: $color-primary;
    }
  }

  .url-info-text {
    margin-bottom: 10px;
  }

  .ds-checkbox {
    line-height: 18px;
    margin-bottom: 10px;
  }

  .datav-editor {
    margin-bottom: 10px;
  }
}
</style>
