<template>
  <div class="ds-wrapper ds-api">
    <p>请求方式</p>
    <div class="datav-new-select-wp">
      <n-select
        v-model:value="apiDataConfig.config.apiMethod"
        :options="apiMethods"
        class="datav-new-select"
      />
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
    <div v-if="apiDataConfig.config.apiMethod === ApiRequestMethod.POST" class="post-request-data">
      <p class="url-info-text">POST 请求参数</p>
      <g-monaco-editor
        language="json"
        :height="120"
        :auto-format="true"
        :code="apiDataConfig.config.apiBody"
        @blur="updateApiBody"
      />
    </div>
    <n-checkbox v-model:checked="apiDataConfig.config.local" class="ds-checkbox">
      服务器代理请求 (因跨域无法访问时可勾选)
    </n-checkbox>
    <n-checkbox v-model:checked="apiDataConfig.config.cookie" class="ds-checkbox">
      需要 cookie (不选择代理并且需要获取cookie时使用)
    </n-checkbox>
  </div>
</template>

<script lang='ts'>
import { defineComponent, inject } from 'vue'
import { ApiRequestMethod } from '@/components/_models/data-source'
import { useEventStore } from '@/store/event'
import { comInjectionKey, sourcePanelInjectionKey } from '../../config'

export default defineComponent({
  name: 'DsApiEditor',
  setup() {
    const eventStore = useEventStore()
    const com = inject(comInjectionKey)
    const { apiDataConfig } = inject(sourcePanelInjectionKey)
    const apiMethods = Object.keys(ApiRequestMethod).map(value => ({ label: value, value }))

    const variables = Object.keys(eventStore.publishersView)

    const updateData = (data: any) => {
      apiDataConfig.value.config.api = data.value
      eventStore.setSubscribersView(com.value.id, data.value)
    }

    const updateApiHeaders = (data: any) => {
      apiDataConfig.value.config.apiHeaders = data.value
    }

    const updateApiBody = (data: any) => {
      apiDataConfig.value.config.apiBody = data.value
    }

    return {
      ApiRequestMethod,
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

<style lang="scss" scoped>
.ds-api {
  .url-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .api-help {
      color: var(--datav-main-color);
    }
  }

  .url-info-text {
    margin-bottom: 10px;
  }

  .ds-checkbox {
    line-height: 18px;
    margin-bottom: 10px;
  }

  ::v-deep(.datav-editor) {
    margin-bottom: 10px;
  }
}
</style>
