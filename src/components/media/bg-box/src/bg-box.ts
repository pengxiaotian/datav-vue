import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/data-source'
import { DataEventConfig } from '@/components/data-event'

/**
 * BgBox
 */
export class BgBox extends DatavComponent {
  config = {
    borderRadius: 0,
    fills: [
      {
        fill: '#003a8c',
        opacity: 10,
      },
      {
        fill: '#003a8c',
        opacity: 12,
      },
    ],
    border: {
      show: true,
      type: 'flat',
      flat: {
        width: 1,
        style: 'solid',
        color: '#008bff',
      },
      linearGradient: {
        width: 2,
        color: {
          angle: 135,
          stops: [
            {
              offset: 0,
              color: '#00DEFF',
            },
            {
              offset: 100,
              color: '#008BFF',
            },
          ],
        },
      },
      imageType: 'custom',
      presetImage: 'box38',
      customImage: {
        source: 'https://files.pengxiaotian.com/datav/custom-bg-border.png',
        slice: '32 37 fill',
        width: '32px 37px',
        outset: '0',
        repeat: 'no-repeat',
      },
    },
    filter: {
      blur: '0px',
    },
    backdropFilter: {
      blur: '0px',
    },
    urlConfig: {
      url: '',
      ifBlank: false,
    },
  }

  apis: ApiConfigMap
  apiData: ApiDataConfigMap

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BgBox', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    this.apis = {} as ApiConfigMap
    this.apiData = {} as ApiDataConfigMap
    this.events = {}
    this.actions = {}

    return this
  }
}

export const borderTypes = [
  { id: 'flat', value: '纯色' },
  { id: 'linearGradient', value: '渐变' },
  { id: 'image', value: '图片' },
]

export const imageTypes = [
  { id: 'preset', value: '预设边框' },
  { id: 'custom', value: '自定义边框' },
]

export const presetImages = [
  {
    id: 'box38', value: '框38', src: `https://files.pengxiaotian.com/bg-box/box38-380-180.png`, width: '14px', outset: '0', slice: '14 fill', repeat: 'stretch',
  },
]

export default BgBox
