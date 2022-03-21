<template>
  <div class="event">
    <div class="events-title" @click="visible = !visible">
      <n-icon :class="visible ? 'events-down' : 'events-up'">
        <IconArrowRight />
      </n-icon>
      <div class="event-text">{{ item.description }}</div>
      <n-checkbox
        v-model:checked="isEnabled"
        class="enable-checkbox"
        @update:checked="onEnableChange"
        @click.stop
      >
        启用
      </n-checkbox>
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
                <new-input
                  :model-value="f.name"
                  placeholder="可自定义"
                  class="attr-input"
                  @change="updateField(f, 'name', $event)"
                />
              </td>
              <td class="variable-input">
                <new-input
                  :model-value="f.map"
                  placeholder="可自定义"
                  class="attr-input"
                  @change="updateField(f, 'map', $event)"
                />
              </td>
              <td class="variable-btn">
                <n-icon class="delete-btn" @click="deleteField(idx)">
                  <IconDelete />
                </n-icon>
              </td>
            </template>
            <template v-else>
              <td>{{ f.name }}</td>
              <td class="variable-input">
                <new-input
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
        <n-button :focusable="false" size="tiny" @click="addField">
          <template #icon>
            <n-icon :size="12">
              <IconPlus />
            </n-icon>
          </template>
          新建一个字段
        </n-button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, PropType, inject } from 'vue'
import { IconArrowRight, IconDelete, IconPlus } from '@/icons'
import { EventItemConfig } from '@/components/_models/data-event'
import { interactionInjectionKey } from '../config'

export default defineComponent({
  name: 'EventItem',
  components: {
    IconArrowRight,
    IconDelete,
    IconPlus,
  },
  props: {
    item: {
      type: Object as PropType<EventItemConfig>,
      required: true,
    },
  },
  setup(props) {
    const iConfig = inject(interactionInjectionKey)
    const visible = ref(true)
    const isEnabled = ref(props.item.enable)

    const addField = () => {
      iConfig.addField(props.item.name)
    }

    const deleteField = (idx: number) => {
      iConfig.deleteField(props.item.name, idx)
    }

    const updateField = (field: any, key: string, value: string) => {
      field[key] = value
      const list = props.item.fields
        .filter(m => m.name)
        .map(m => ({ name: m.name, map: m.map }))
      iConfig.updateField(props.item.name, list)
    }

    const onEnableChange = (enable: boolean) => {
      props.item.enable = enable
      iConfig.toggleEnable(props.item.name, enable)
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
