import { defineStore } from 'pinia'
import { debounce } from 'lodash-es'
import { Project } from '@/domains/project'
import { PageConfig, AlignLine } from '@/domains/editor'
import { getProject } from '@/api/project'
import { DatavComponent } from '@/components/_models/datav-component'
import { calcIntersectingLines } from '@/utils/editor'
import { useComStore } from './com'
import { useEventStore } from './event'

export interface IEditorState {
  editMode: boolean
  screen: Partial<Project>
  pageConfig: PageConfig
  canvas: {
    scale: number
    width: number
    height: number
  }
  guideLine: {
    h: number[]
    v: number[]
  }
  referLine: {
    enable: boolean
  }
  alignLine: AlignLine
  areaData: {
    top: number
    left: number
    width: number
    height: number
  }
  contextMenu: {
    show: boolean
  }
  isNormalResizeMode: boolean
}

export const useEditorStore = defineStore('editor', {
  state: (): IEditorState => ({
    editMode: false,
    screen: {
      id: 0,
      name: '',
      share: '',
      thumbnail: '',
      groupId: 0,
    },
    pageConfig: {
      width: 1920,
      height: 1080,
      bgimage: '//files.pengxiaotian.com/datav/bj.png',
      bgcolor: 'rgba(13,42,67,0)',
      grid: 8,
      screenshot: '',
      zoomMode: 1,
      useWatermark: true,
      styleFilterParams: {
        enable: false,
        hue: 0,
        saturate: 100,
        brightness: 100,
        contrast: 100,
        opacity: 100,
      },
    },
    canvas: {
      scale: 0.2,
      width: 1920,
      height: 1080,
    },
    guideLine: {
      h: [],
      v: [],
    },
    referLine: {
      enable: true,
    },
    alignLine: {
      enable: false,
      show: false,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      vertical: 0,
      horizontal: 0,
    },
    areaData: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
    contextMenu: {
      show: false,
    },
    isNormalResizeMode: true,
  }),
  actions: {
    setEditMode() {
      this.editMode = true
    },
    setEditorOption(payload: {
      screen?: Partial<Project>
      config?: Partial<PageConfig>
      guideLine?: {
        h: number[]
        v: number[]
      }
    }) {
      if (payload.screen) {
        this.screen = { ...this.screen, ...payload.screen }
      }

      if (payload.config) {
        this.pageConfig = { ...this.pageConfig, ...payload.config }
      }

      if (payload.guideLine) {
        this.guideLine = { ...payload.guideLine }
      }
    },
    calcAlignLine(com: DatavComponent) {
      if (!this.alignLine.enable) {
        return
      }

      const comStore = useComStore()
      const attr = calcIntersectingLines(com, comStore.coms, this.canvas.scale)
      this.alignLine = { ...this.alignLine, ...attr, show: true }
    },
    hideAlignLine(id: string) {
      if (!this.alignLine.enable) {
        return
      }

      const comStore = useComStore()
      if (this.alignLine.show) {
        this.alignLine.show = false
        comStore.select(id)
      }
    },
    async autoCanvasScale(offset: () => { x: number; y: number; }) {
      const resize = debounce(() => {
        const { x, y } = offset()
        const width = document.documentElement.clientWidth - x
        const height = document.documentElement.clientHeight - y

        const a = (width - 180) / this.pageConfig.width
        const b = (height - 200) / this.pageConfig.height
        const scale = parseFloat((a > b ? b : a).toFixed(6)) * 100

        this.setCanvasScale(scale, x, y)
      }, 200)

      window.onresize = resize

      resize()
    },
    async setCanvasScale(scale: number, offsetX: number, offsetY: number) {
      // 减去滚动条 4px
      let width = document.documentElement.clientWidth - offsetX - 4
      let height = document.documentElement.clientHeight - offsetY - 4
      const deltaS = Math.min(Math.max(scale, 10), 200) / 100

      // 方便计算滚动条 和 标尺
      const deltaW = this.pageConfig.width * deltaS
      const deltaH = this.pageConfig.height * deltaS
      if (width < deltaW) {
        width = deltaW + 400
      }

      if (height < deltaH) {
        height = deltaH + 390
      }

      this.canvas = { scale: deltaS, width, height }
    },
    async loadScreen(projectId: number) {
      try {
        const eventStore = useEventStore()
        const { data } = await getProject(projectId)
        if (data.code === 0) {
          const { config } = data.data
          this.setEditorOption({
            screen: {
              id: projectId,
              name: data.data.name,
            },
            config: {
              bgcolor: config.bgcolor,
              width: config.width,
              height: config.height,
              bgimage: config.bgimage,
              screenshot: config.screenshot,
              zoomMode: config.zoomMode,
              useWatermark: config.useWatermark,
              grid: config.grid,
              styleFilterParams: config.styleFilterParams,
            },
          })
          const { componentsView, publishersView, subscribersView } = config.variables
          eventStore.$patch({ componentsView, publishersView, subscribersView })
        } else {
          throw Error(data.message)
        }
      } catch (error) {
        throw error
      }
    },
  },
})
