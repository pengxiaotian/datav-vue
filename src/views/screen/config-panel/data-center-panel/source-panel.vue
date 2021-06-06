<template>
  <div
    :class="['api-editor', {
      '--disable-fold': !collapse,
      '--fold': collapse && visible
    }]"
  >
    <div class="api-editor-title">
      <div class="api-desc ellipsis2" @click="toggle">
        <i v-if="collapse" class="el-icon-arrow-right api-fold-icon"></i>
        {{ apiConfig.description || '数据接口' }}
      </div>
      <div class="api-status success">
        <display-api-status :status="totalStatus" success-text="配置完成" />
      </div>
    </div>
    <div v-show="visible" class="attr-source-wp">
      <div class="data-attr-table-container">
        <table class="data-attr-table">
          <thead class="table-head">
            <tr class="table-head-row">
              <th class="th-item column-item attr-name">
                字段
              </th>
              <th class="th-item column-item attr-value">
                映射
              </th>
              <th class="th-item column-item attr-status">
                状态
              </th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="(fc, fn) in apiConfig.fields"
              :key="fn"
              class="table-body-row"
            >
              <td class="column-item attr-name">
                <el-tooltip
                  :content="fc.description"
                  placement="left"
                  effect="blue"
                >
                  <span class="ellipsis2">{{ fn }}</span>
                </el-tooltip>
              </td>
              <td class="column-item attr-value">
                <g-input
                  :model-value="fc.map"
                  placeholder="可自定义"
                  class="attr-input"
                  @change="fc.map = $event"
                />
              </td>
              <td class="column-item attr-status">
                <display-api-status :status="fieldsStatus[fn]" :optional="fc.optional" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="data-source">
        <div class="data-result-title">
          数据响应结果
        </div>
        <div class="auto-update-config">
          <el-checkbox v-model="apiConfig.useAutoUpdate" class="auto-update-checkbox">
            自动更新选项
          </el-checkbox>
          <g-input
            :model-value="apiConfig.autoUpdate"
            type="number"
            :disabled="!apiConfig.useAutoUpdate"
            class="update-interval-input"
            @change="apiConfig.autoUpdate = $event"
          />
          秒一次
        </div>
        <div class="data-flow-wp">
          <div class="ds-line">
            <div class="ds-title">
              <span class="ds-title-text">数据源</span>
              <span class="ds-type-text">{{ apiDataConfig.type }}</span>
            </div>
            <el-button
              size="mini"
              class="ds-action-btn"
              @click="showDataSource"
            >
              配置数据源
            </el-button>
          </div>
          <div class="ds-line mt5">
            <span>数据响应结果 ( 只读 ) </span>
            <el-tooltip content="刷新数据" placement="left" effect="blue">
              <i class="el-icon-refresh refresh-btn"></i>
            </el-tooltip>
          </div>
          <div class="ds-dots">
            <span class="ds-dot" :class="[totalStatus === 'completed' ? 'active' : 'error']"></span>
            <span class="ds-dot"></span>
            <span class="ds-dot"></span>
          </div>
        </div>
        <div class="data-response">
          <g-monaco-editor
            language="json"
            :read-only="true"
            :code="datav_data"
            :height="250"
            full-screen-title="数据响应结果"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, ComputedRef, inject } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { ApiConfig, ApiDataConfig, FieldStatus } from '@/components/data-source'
import { ApiStatus } from '@/utils/enums/data-source'
import { ApiModule } from '@/store/modules/api'
import DisplayApiStatus from '../components/display-api-status.vue'

export default defineComponent({
  name: 'SourcePanel',
  components: {
    DisplayApiStatus,
  },
  props: {
    apiName: String,
    activeName: String,
    collapse: Boolean,
  },
  setup(props) {
    const visible = computed(() => props.apiName === props.activeName)

    const com = inject('com') as ComputedRef<DatavComponent>
    const apiConfig = computed((): ApiConfig => com.value.apis[props.apiName])
    const apiDataConfig = computed((): ApiDataConfig => com.value.apiData[props.apiName])

    const datav_data = computed(() => {
      const comData = ApiModule.dataMap[com.value.id]
      return comData ? comData[props.apiName] : ''
    })

    const fieldsStatus = computed(() => {
      const comFields = ApiModule.fieldStatusMap[com.value.id]
      return comFields ? comFields[props.apiName] : {}
    })

    const totalStatus = computed(() => {
      const list = Object.values(fieldsStatus.value)
      if (list.includes(FieldStatus.loading)) {
        return ApiStatus.loading
      }

      if (list.includes(FieldStatus.failed)) {
        return ApiStatus.incomplete
      }

      return ApiStatus.completed
    })

    const changePanel = inject('changePanel') as Function

    const toggle = () => {
      if (props.collapse) {
        changePanel(props.apiName)
      }
    }

    const showDataSource = () => {
      // this.currInfo.comId = this.comId
      // this.currInfo.sourceId = this.source.id
      // this.currInfo.apiName = this.apiName
      // this.toolPanels.datasource = true
    }

    return {
      visible,
      com,
      apiConfig,
      apiDataConfig,
      fieldsStatus,
      totalStatus,
      datav_data,
      toggle,
      showDataSource,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.api-editor {
  .api-editor-title {
    display: flex;
    width: 100%;
    height: 38px;
    padding-right: 34px;
    padding-left: 10px;
    font-size: $font-size;
    background: $config-panel-bgcolor;
    border-top: $config-panel-border;
    border-bottom: $config-panel-border;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    transition: 0.4s;
  }

  .api-desc {
    max-width: 160px;
    color: $color-white;
    white-space: initial;
    cursor: pointer;
  }

  .api-fold-icon {
    transition: transform 0.3s;
  }

  &.--disable-fold {
    .api-desc {
      cursor: default;
    }
  }

  &.--fold {
    .api-fold-icon {
      transform: rotate(90deg);
    }
  }
}

.data-attr-table {
  width: 100%;
  color: $font-color;
  text-align: left;

  .table-head {
    display: block;
    width: 100%;
    height: 40px;
    font-size: 0;
    line-height: 40px;
    border-bottom: $config-panel-border;

    .table-head-row {
      display: block;
      width: 100%;
      height: 100%;
    }

    .th-item {
      font-weight: 400;
    }
  }

  .table-body {
    display: block;
    width: 100%;
    padding-bottom: 10px;

    .table-body-row {
      display: block;
      width: 100%;
    }
  }

  .table-head,
  .table-body {
    .column-item {
      display: inline-flex;
      height: 40px;
      padding: 0 6px;
      font-size: 12px;
      line-height: 17px;
      vertical-align: middle;
      box-sizing: border-box;
      align-items: center;

      &:first-child {
        padding-left: 10px;
      }
    }

    .attr-name {
      width: 19%;
    }

    .attr-value {
      width: 41%;
    }

    .attr-status {
      width: 40%;
    }

    .attr-input {
      width: 108px;
      height: 24px;

      .el-input__inner {
        height: 24px;
        line-height: 24px;
        color: $font-color-secondary;
      }
    }
  }
}

.data-source {
  color: $font-color;
  user-select: none;

  .data-result-title {
    padding: 10px;
    border-top: $config-panel-border;
    border-bottom: $config-panel-border;
  }

  .auto-update-config {
    display: block;
    margin-top: 15px;
    margin-left: 10px;
  }

  .auto-update-checkbox {
    margin-right: 5px;
    line-height: 16px;
    vertical-align: middle;
  }

  .update-interval-input {
    width: 36px;
    margin: 0 5px;
    vertical-align: middle;
  }

  .data-flow-wp {
    position: relative;
    padding: 10px;
  }

  .ds-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0 5px 20px;

    &.mt5 {
      margin-top: 5px;
    }

    .ds-type-text {
      display: inline-block;
      padding: 3px 5px;
      margin-left: 7px;
      font-size: 12px;
      line-height: 12px;
      color: $font-color;
      text-align: center;
      background: $input-prepend-bgcolor;
      border-radius: 1px;
      box-shadow: 0 0 5px -3px #000;
    }

    .ds-action-btn {
      width: 120px;
    }

    .refresh-btn {
      font-size: 16px;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: $color-primary;
      }
    }
  }

  .ds-dots {
    position: absolute;
    top: 25px;
    left: 15px;
    display: flex;
    width: 1px;
    height: 87px;
    background: $config-dot-list-bgcolor;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .ds-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: $config-dot-bgcolor;
    border-radius: 4px;
    box-shadow: 0 0 3px #000;
    transition: background 0.2s;

    &.active {
      background: $color-primary;
    }

    &.error {
      background: $color-error;
    }
  }

  .data-response {
    padding: 10px;
    padding-top: 0;
  }
}
</style>
