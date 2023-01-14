import { DatavEChartsComponent, DatavChartSeries } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

export class WordCloudSeries extends DatavChartSeries {
  color = '#fff'

  constructor(name: string, color: string) {
    super('wordCloud', name)

    this.color = color
  }
}

/**
 * WordCloud
 */
export class WordCloud extends DatavEChartsComponent {
  config = {
    global: {
      fontFamily: 'Microsoft Yahei',
      max: 35,
      min: 14,
      rotationRange: {
        min: -90,
        max: 90,
      },
      rotate: 45,
      drawType: 'preset',
      shape: 'circle',
      image: 'https://files.pengxiaotian.com/datav/echarts-logo.png',
    },
    series: [
      new WordCloudSeries('0', '#0a73ff'),
      new WordCloudSeries('1', '#3dabff'),
      new WordCloudSeries('2', '#79daff'),
    ],
    tooltip: {
      show: false,
      textStyle: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'normal',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    animation: {
      enabled: true,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('WordCloud', { w: 300, h: 200 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('name', { description: '名称' }),
      createField('value', { description: '值' }),
      createField('type', { description: '系列' }),
    ]

    setApiConfig(this, {
      fields: Object.assign({}, ...fields),
    })

    setApiData(this)

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      const path = 'chart/word-cloud'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export const drawTypes = [
  { id: 'preset', value: '内置图形' },
  { id: 'image', value: '自定义图形' },
]

export const simpleShapes = [
  { id: 'circle', value: '圆形' },
  { id: 'triangle', value: '三矩形' },
  { id: 'diamond', value: '菱形' },
  { id: 'pentagon', value: '五角星' },
]

export default WordCloud
