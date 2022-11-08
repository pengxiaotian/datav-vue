<template>
  <div class="interaction-panle">
    <config-title />
    <children-manager />
    <div v-if="eventKeys.length > 0">
      <div class="com-events">
        <div class="events-title" @click="visible = !visible">
          <n-icon :class="visible ? 'events-down' : 'events-up'">
            <IconArrowRight />
          </n-icon>
          <span>{{ '交互事件' }}</span>
          <span class="extra">
            <router-link
              :to="{ name: 'MyCase' }"
              target="_blank"
              rel="noopener noreferrer"
              class="tutorial-link"
            >教程</router-link>
          </span>
        </div>
        <div v-show="visible" class="event-list">
          <event-item
            v-for="eitem in eventList"
            :key="eitem.name"
            :item="eitem"
          />
        </div>
      </div>
    </div>
    <empty-panel v-else content="该组件没有交互事件" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, inject, ref, provide, onMounted, watch } from 'vue'
import { EventItemConfig } from '@/components/_models/data-event'
import { useEventStore } from '@/store/event'
import { ArrayToObject } from '@/utils/util'
import { IconArrowRight } from '@/icons'
import { comInjectionKey, interactionInjectionKey } from '../config'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'
import EventItem from './event-item.vue'
import ChildrenManager from '../components/children-manager.vue'

export default defineComponent({
  name: 'InteractionPanel',
  components: {
    IconArrowRight,
    ConfigTitle,
    EmptyPanel,
    EventItem,
    ChildrenManager,
  },
  setup() {
    const eventStore = useEventStore()
    const com = inject(comInjectionKey)
    const visible = ref(true)

    const eventKeys = computed(() => {
      return Object.keys(com.value.events)
    })

    const eventList = ref<EventItemConfig[]>([])
    let events = ref(eventStore.componentsView[com.value.id])

    const createField = (name: string, mapName: string, description: string, custom = false) => {
      return {
        name,
        map: mapName || name,
        description,
        custom,
      }
    }

    const initEvent = (eventName: string) => {
      if (!events.value) {
        events.value = {}
      }

      if (!events.value[eventName]) {
        const fields = Object.keys(com.value.events[eventName].fields)
        events.value[eventName] = {
          enable: false,
          fields: ArrayToObject(fields),
        }
      }
    }

    const mergeEventFields = () => {
      const list: EventItemConfig[] = []
      for (const [key, value] of Object.entries(com.value.events)) {
        const config: EventItemConfig = {
          name: key,
          description: value.description,
          enable: false,
          fields: Object.entries(value.fields)
            .map(([name, fc]) => createField(name, '', fc.description)),
        }

        if (events.value) {
          const eventItem = events.value[key]
          if (eventItem) {
            config.enable = eventItem.enable
            for (const [fn, fm] of Object.entries(eventItem.fields)) {
              const field = config.fields.find(m => m.name === fn)
              if (field) {
                field.map = fm
              } else {
                config.fields.push(createField(fn, fm, '', true))
              }
            }
          }
        }

        list.push(config)
      }
      eventList.value.push(...list)
    }

    const addField = (eventName: string) => {
      const eventItem = eventList.value.find(m => m.name === eventName)
      if (!eventItem.fields.some(m => m.name === '')) {
        eventItem.fields.push(createField('', '', '', true))
      }
    }

    const deleteField = (eventName: string, idx: number) => {
      const eventItem = eventList.value.find(m => m.name === eventName)
      const fieldName = eventItem.fields.splice(idx, 1)[0].name
      if (fieldName) {
        delete events.value[eventName].fields[fieldName]

        const eItem = events.value[eventName]
        if (eItem.enable) {
          eventStore.setPublishersView(
            com.value.id,
            Object.entries(eItem.fields).map(m => m[1] || m[0]),
            true,
          )
        }
      }
    }

    const updateField = (eventName: string, fields: { name: string; map: string; }[]) => {
      initEvent(eventName)
      events.value[eventName].fields = ArrayToObject(fields, 'name', 'map')

      if (events.value[eventName].enable) {
        eventStore.setPublishersView(
          com.value.id,
          fields.map(m => m.map || m.name),
          true,
        )
      }
    }

    const toggleEnable = (eventName: string, enable: boolean) => {
      initEvent(eventName)
      const eventItem = events.value[eventName]
      eventItem.enable = enable
      const keys: string[] = []
      for (const key in eventItem.fields) {
        if (enable && !eventItem.fields[key]) {
          eventItem.fields[key] = key
        }
        keys.push(eventItem.fields[key])
      }

      eventStore.setPublishersView(com.value.id, keys, enable)
    }

    provide(interactionInjectionKey, {
      addField,
      deleteField,
      updateField,
      toggleEnable,
    })

    watch(events, () => {
      eventStore.componentsView[com.value.id] = events.value
    })

    onMounted(() => {
      mergeEventFields()
    })

    return {
      com,
      eventKeys,
      visible,
      eventList,
    }
  },
})
</script>

<style lang="scss">
@import './style.scss';
</style>
