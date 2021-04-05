import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'

config.rawError = true

export enum PanelType {
  layer = 'layer',
  comList = 'comList',
  config = 'config',
}

const panelStateKey = 'panel-state'

function getPanelState(key: PanelType) {
  try {
    const val = localStorage.getItem(panelStateKey) || ''
    return JSON.parse(val)[key] === '1'
  } catch (error) {
    return key !== PanelType.comList
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
  comList: {
    show: boolean
  }
  config: {
    show: boolean
  }
  toolPanels: {
    datasource: boolean
    filterManager: boolean
  }
}

/* endregion */

@Module({ dynamic: true, store, name: 'toolbar' })
class Toolbar extends VuexModule implements IToolbarState {
  layer = {
    show: getPanelState(PanelType.layer),
  }

  comList = {
    show: getPanelState(PanelType.comList),
  }

  config = {
    show: getPanelState(PanelType.config),
  }

  toolPanels = {
    datasource: false,
    filterManager: false,
  }

  @Mutation
  private SET_PANEL_STATE(payload: { type: PanelType; value: boolean; }) {
    switch (payload.type) {
      case PanelType.comList:
        this.comList.show = payload.value
        break
      case PanelType.config:
        this.config.show = payload.value
        break
      case PanelType.layer:
        this.layer.show = payload.value
        break
    }

    setPanelState(payload.type, payload.value ? '1' : '0')
  }

  @Action
  public setPanelState(payload: { type: PanelType; value: boolean; }) {
    this.SET_PANEL_STATE(payload)
  }
}

export const ToolbarModule = getModule(Toolbar)
