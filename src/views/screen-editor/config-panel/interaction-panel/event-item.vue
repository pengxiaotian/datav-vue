<template>
  <div class="event">
    <div class="events-title" @click="visible = !visible">
      <i
        class="v-icon-arrow-right"
        :class="visible ? 'events-down' : 'events-up'"
      ></i>
      <div class="event-text">{{ item.description }}</div>
      <el-checkbox v-model="isEnabled" class="enable-checkbox" @change="onEnableChange">
        启用
      </el-checkbox>
    </div>
    <div v-if="visible" class="variables">
      <table class="variables-table">
        <thead>
          <tr>
            <th width="80"><span>字段</span></th>
            <th width="110" style="position: relative;">
              <span>绑定到变量</span>
            </th>
            <th width="110">
              <span>字段说明</span>
            </th>
          </tr>
        </thead>
        <tbody class="variables-tbody">
          <tr v-for="(f, idx) in item.fields" :key="idx">
            <template v-if="f.custom">
              <td class="variable-input">
                <g-input
                  :model-value="f.name"
                  placeholder="可自定义"
                  class="attr-input"
                  @change="updateField(f, 'name', $event)"
                />
              </td>
              <td class="variable-input">
                <g-input
                  :model-value="f.map"
                  placeholder="可自定义"
                  class="attr-input"
                  @change="updateField(f, 'map', $event)"
                />
              </td>
              <td class="variable-btn">
                <i class="v-icon-delete delete-btn" @click="deleteField(idx)"></i>
              </td>
            </template>
            <template v-else>
              <td>{{ f.name }}</td>
              <td class="variable-input">
                <g-input
                  :model-value="f.map"
                  placeholder="可自定义"
                  class="attr-input"
                  @change="updateField(f, 'map', $event)"
                />
              </td>
              <td class="desc">{{ f.description }}</td>
            </template>
          </tr>
        </tbody>
      </table>
      <div class="add-variable">
        <el-button size="mini" icon="v-icon-plus" @click="addField">
          新建一个字段
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, PropType, inject } from 'vue'
import { EventItemConfig } from '@/components/data-event'

export default defineComponent({
  name: 'EventItem',
  props: {
    item: {
      type: Object as PropType<EventItemConfig>,
      required: true,
    },
  },
  setup(props) {
    const visible = ref(true)
    const isEnabled = ref(props.item.enable)

    const doAddField = inject('addField') as (eventName: string) => void
    const doDeleteField = inject('deleteField') as (eventName: string, idx: number) => void
    const doUpdateField = inject('updateField') as (eventName: string, fields: { name: string; map: string;}[]) => void
    const doToggleEnable = inject('toggleEnable') as (eventName: string, enable: boolean) => void

    const addField = () => {
      doAddField(props.item.name)
    }

    const deleteField = (idx: number) => {
      doDeleteField(props.item.name, idx)
    }

    const updateField = (field: any, key: string, value: string) => {
      field[key] = value
      const list = props.item.fields
        .filter(m => m.name)
        .map(m => ({ name: m.name, map: m.map }))
      doUpdateField(props.item.name, list)
    }

    const onEnableChange = (enable: boolean) => {
      props.item.enable = enable
      doToggleEnable(props.item.name, enable)
    }

    return {
      visible,
      isEnabled,
      addField,
      deleteField,
      updateField,
      onEnableChange,
    }
  },
})
</script>

<style lang="scss">
@import '@/styles/themes/var';

.events-title {
  position: relative;
  line-height: 38px;
  padding-left: 16px;
  background: $config-panel-bgcolor;
  border-bottom: $config-panel-border;
  color: $font-color;
  cursor: pointer;
  display: flex;

  .event-text {
    width: 150px;
    line-height: 1;
    align-items: center;
    display: flex;
    padding: 4px 0;
  }

  .enable-checkbox {
    position: absolute;
    right: 10px;
    font-weight: normal;
    line-height: 38px;
  }
}

.event {
  .variables {
    padding: 0 10px;
    color: $font-color;
    background: #15171c;

    .variables-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      border-spacing: 0;

      thead {
        border-bottom: $config-panel-border;
      }

      th,
      td {
        height: 38px;
        vertical-align: middle;
        text-align: left;
        font-weight: unset;

        &:first-child {
          text-indent: 11px;
        }
      }

      .variable-input .attr-input {
        width: 66px;
        height: 24px;
        padding: 0 5px;
        background: #000;
        color: #fff;
        border: 1px solid transparent;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .variable-btn .delete-btn {
        cursor: pointer;

        &:hover {
          color: $color-primary;
        }
      }
    }

    .add-variable {
      padding-top: 20px;
      padding-bottom: 20px;
      border-top: $config-panel-border;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
