import { ZoomMode } from '@/utils/enums'

export interface PageStyleFilter {
  enable: boolean
  hue: number
  saturate: number
  brightness: number
  contrast: number
  opacity: number
}

export interface PageVariable {
  /**
   * 定义事件中 emit 出的变量
   */
  componentsView: {
    [key: string]: {
      [key: string]: {
        enable: boolean
        fields: Record<string, string>
      }
    }
  }
  /**
   * 发布事件的组件
   *
   * 形如: { [变量名]: [组件id, ...] }
   */
  publishersView: Record<string, string[]>
  /**
   * 订阅事件的组件
   *
   * 形如: { [变量名]: [组件id, ...] }
   */
  subscribersView: Record<string, string[]>
}

export interface PageConfig {
  width: number
  height: number
  bgcolor: string
  bgimage: string
  grid: number
  screenshot: string
  zoomMode: ZoomMode
  useWatermark: boolean
  styleFilterParams: PageStyleFilter
}
