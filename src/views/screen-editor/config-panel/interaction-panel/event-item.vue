<template>
  <div class="event">
    <div class="events-title" @click="visible = !visible">
      <i
        class="v-icon-arrow-right"
        :class="visible ? 'events-down' : 'events-up'"
      ></i>
      <div class="event-text">{{ item.description }}</div>
      <el-checkbox v-model="isEnabled" class="enable-checkbox">
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
          <tr v-for="(f, key, idx) in item.fields" :key="idx">
            <template v-if="f.new">
              <td class="variable-input">
                <input type="text" placeholder="可自定义">
              </td>
              <td class="variable-input">
                <input type="text" placeholder="可自定义">
              </td>
              <td class="variable-btn">
                <i class="v-icon-delete delete-btn" @click="deleteField(key)"></i>
              </td>
            </template>
            <template v-else>
              <td>{{ key }}</td>
              <td class="variable-input">
                <input type="text" placeholder="可自定义">
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
import { defineComponent, ref, PropType } from 'vue'
import { DataEventConfig } from '@/components/data-event'
import { createField } from '@/components/data-field'

export default defineComponent({
  name: 'EventItem',
  props: {
    item: {
      type: Object as PropType<DataEventConfig>,
      required: true,
    },
  },
  setup(props) {
    const visible = ref(true)
    const isEnabled = ref(false)

    const addField = () => {
      const field = createField('', { new: true })
      props.item.fields[''] = field['']
    }

    const deleteField = (key: string) => {
      delete props.item.fields[key]
    }

    return {
      visible,
      isEnabled,
      addField,
      deleteField,
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

      .variable-input input[type="text"] {
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

      .variable-btn i {
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
