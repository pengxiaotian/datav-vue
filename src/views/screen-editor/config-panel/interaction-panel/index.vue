<template>
  <div class="interaction-panle">
    <config-title :com-name="com.name" :com-alias="com.alias" />
    <div v-if="eventKeys.length > 0">
      <div class="com-events">
        <div class="events-title" @click="visible = !visible">
          <div>
            <i
              class="v-icon-arrow-right"
              :class="visible ? 'events-down' : 'events-up'"
            ></i>{{ '交互事件' }}
          </div>
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
            v-for="(item, key) in com.events"
            :key="key"
            :item="item"
          />
        </div>
      </div>
    </div>
    <empty-panel v-else content="该组件没有交互事件" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, ComputedRef, inject, ref } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'
import EventItem from './event-item.vue'

export default defineComponent({
  name: 'InteractionPanel',
  components: {
    ConfigTitle,
    EmptyPanel,
    EventItem,
  },
  setup() {
    const com = inject('com') as ComputedRef<DatavComponent>
    const visible = ref(true)

    const eventKeys = computed(() => {
      return Object.keys(com.value.events)
    })

    return {
      com,
      eventKeys,
      visible,
    }
  },
})
</script>

<style lang="scss">
@import '@/styles/themes/var';

.interaction-panle {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  .com-events > .events-title {
    height: 35px;
    line-height: 35px;
    background: $config-panel-bgcolor;
    padding: 0 10px;
    border-bottom: $config-panel-border;
    color: $font-color;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }

  .events-up {
    margin-right: 2px;
    transition: 0.2s transform ease-in;
  }

  .events-down {
    margin-right: 2px;
    transition: 0.2s transform ease-in;
    transform: rotate(90deg);
  }

  .tutorial-link {
    color: $font-color;
    text-decoration: none;
    cursor: pointer;
  }

  .event-list {
    font-size: 12px;
  }
}
</style>
