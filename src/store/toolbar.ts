import { defineStore } from 'pinia'

export enum PanelType {
  layer = 'layer',
  components = 'components',
  config = 'config',
  toolbox = 'toolbox',
  filter = 'filter'
}

const panelStateKey = 'panel-state'

function getPanelState(key: PanelType) {
  try {
    const val = localStorage.getItem(panelStateKey) || ''
    return JSON.parse(val)[key] === '1'
  } catch (error) {
    return key !== PanelType.components
  }
}

function setPanelState(key: PanelType, value: '0' | '1') {
  let map = {}

  try {
    const val = localStorage.getItem(panelStateKey) || '{}'
    map = JSON.parse(val)
    map[key] = value
  } catch (error) {
    map[key] = value
  }

  localStorage.setItem(panelStateKey, JSON.stringify(map))
}

export const useToolbarStore = defineStore('toolbar', {
  state: () => ({
    layer: {
      show: getPanelState(PanelType.layer),
    },
    components: {
      show: getPanelState(PanelType.components),
    },
    config: {
      show: getPanelState(PanelType.config),
    },
    toolbox: {
      show: getPanelState(PanelType.toolbox),
    },
    filter: {
      show: false,
    },
    loading: 0,
  }),
  getters: {
    getPanelOffset(state) {
      let x = 0
      let y = 41
      let left = 60
      let top = 100
      if (state.layer.show) {
        x += 200
        left += 200
      }

      if (state.components.show) {
        x += 324
        left += 324
      } else {
        x += 45
        left += 45
      }

      if (state.toolbox.show) {
        y += 40
        top += 40
      }

      if (state.config.show) {
        x += 332
      }

      return {
        x,
        y,
        left,
        top,
      }
    },
  },
  actions: {
    setPanelState(type: PanelType, value: boolean) {
      switch (type) {
        case PanelType.components:
          this.components.show = value
          break
        case PanelType.config:
          this.config.show = value
          break
        case PanelType.layer:
          this.layer.show = value
          break
        case PanelType.toolbox:
          this.toolbox.show = value
          break
      }

      setPanelState(type, value ? '1' : '0')
    },
    setFilterState(value: boolean) {
      this.filter.show = value
    },
    addLoading() {
      this.loading = this.loading + 1
    },
    removeLoading() {
      this.loading = Math.max(this.loading - 1, 0)
    },
    removeAllLoading() {
      this.loading = 0
    },
  },
})
