import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'

config.rawError = true

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
  let map: Hash<string> = {}

  try {
    const val = localStorage.getItem(panelStateKey) || '{}'
    map = JSON.parse(val)
    map[key] = value
  } catch (error) {
    map[key] = value
  }

  localStorage.setItem(panelStateKey, JSON.stringify(map))
}


/* region interfaces */

export interface IToolbarState {
  layer: {
    show: boolean
  }
  components: {
    show: boolean
  }
  config: {
    show: boolean
  }
  toolbox: {
    show: boolean
  }
  filter: {
    show: boolean
  }
  loading: number
}

/* endregion */

@Module({ dynamic: true, store, name: 'toolbar' })
class Toolbar extends VuexModule implements IToolbarState {
  layer = {
    show: getPanelState(PanelType.layer),
  }

  components = {
    show: getPanelState(PanelType.components),
  }

  config = {
    show: getPanelState(PanelType.config),
  }

  toolbox = {
    show: getPanelState(PanelType.toolbox),
  }

  filter = {
    show: false,
  }

  loading = 0

  public get getPanelOffsetX() {
    let offsetX = 0
    if (this.layer.show) {
      offsetX += 200
    }

    if (this.components.show) {
      offsetX += 233
    } else {
      offsetX += 45
    }

    if (this.config.show) {
      offsetX += 332
    }

    return offsetX
  }

  public get getPanelOffsetY() {
    let offsetY = 0
    if (this.toolbox.show) {
      offsetY += 40
    }

    return offsetY
  }

  @Mutation
  private SET_PANEL_STATE(payload: { type: PanelType; value: boolean; }) {
    switch (payload.type) {
      case PanelType.components:
        this.components.show = payload.value
        break
      case PanelType.config:
        this.config.show = payload.value
        break
      case PanelType.layer:
        this.layer.show = payload.value
        break
      case PanelType.toolbox:
        this.toolbox.show = payload.value
        break
    }

    setPanelState(payload.type, payload.value ? '1' : '0')
  }

  @Mutation
  private SET_LOADING(payload: number) {
    this.loading = payload
  }

  @Action
  public setPanelState(payload: { type: PanelType; value: boolean; }) {
    this.SET_PANEL_STATE(payload)
  }

  @Action
  public addLoading() {
    this.SET_LOADING(this.loading + 1)
  }

  @Action
  public removeLoading() {
    this.SET_LOADING(this.loading - 1)
  }

  @Action
  public removeAllLoading() {
    this.SET_LOADING(0)
  }
}

export const ToolbarModule = getModule(Toolbar)
