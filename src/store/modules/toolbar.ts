import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import _ from 'lodash'

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
  canvas: {
    scale: number
  }
  screen: {
    width: number
    height: number
  }
  referLine: {
    enable: boolean
  }
  alignLine: {
    top: number
    bottom: number
    left: number
    right: number
    vertical: number
    horizontal: number
    enable: boolean
    show: boolean
  }
  contextMenu: {
    show: boolean
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

  canvas = {
    scale: 1,
  }

  screen = {
    width: 0,
    height: 0,
  }

  referLine = {
    enable: true,
  }

  alignLine = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    vertical: 0,
    horizontal: 0,
    enable: false,
    show: false,
  }

  contextMenu = {
    show: false,
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

  @Mutation
  private SET_SCALE(payload: number) {
    this.canvas.scale = payload
  }

  @Mutation
  private SET_SIZE(payload: { width: number; height: number; }) {
    this.screen.width = payload.width
    this.screen.height = payload.height
  }

  @Action
  public setPanelState(payload: { type: PanelType; value: boolean; }) {
    this.SET_PANEL_STATE(payload)
  }

  @Action
  public async autoCanvasScale(payload: { width: number; height: number; }) {
    const resize = _.debounce(() => {
      const { clientHeight, clientWidth } = document.documentElement
      const ch = clientHeight
      let cw = clientWidth - 110

      if (this.layer.show) {
        cw -= 200
      }

      if (this.comList.show) {
        cw -= 233
      }

      if (this.config.show) {
        cw -= 332
      }

      const a = cw / payload.width
      const b = (ch - 180) / payload.height
      const c = parseFloat((a > b ? b : a).toFixed(6))

      this.SET_SCALE(c < 0.2 ? 0.2 : c)
      this.SET_SIZE({ width: cw, height: ch - 41 })
    }, 200)

    if (!window.onresize) {
      window.onresize = resize
    }

    resize()
  }

  @Action
  public async setCanvasScale(payload: { scale: number; width: number; height: number; }) {
    let { scale } = payload
    if (scale < 20) {
      scale = 20
    }

    if (scale > 200) {
      scale = 200
    }

    scale /= 100

    const w = payload.width * scale
    const h = payload.height * scale

    let ch = document.documentElement.clientHeight
    let cw = document.documentElement.clientWidth

    if (this.layer.show) {
      cw -= 200
    }

    if (this.comList.show) {
      cw -= 233
    }

    if (this.config.show) {
      cw -= 332
    }

    const a = cw - w
    const b = ch - h
    if (a < 0) {
      cw = w + 400
    } else if (a < 150) {
      cw += 150 - a
    }

    if (b < 0) {
      ch = h + 400
    } else if (b < 200) {
      ch += 200 - b
    }

    this.SET_SCALE(scale)
    this.SET_SIZE({ width: cw, height: ch - 41 })
  }
}

export const ToolbarModule = getModule(Toolbar)
