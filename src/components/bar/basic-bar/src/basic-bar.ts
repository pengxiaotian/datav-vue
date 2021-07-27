import { DatavEChartsComponent, DatavChartSeries } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

export class BasicBarSeries extends DatavChartSeries {
  constructor(name: string) {
    super('bar', name)
  }

  color = {
    type: 'solid',
    value: '#00baff',
    from: '#fff',
    to: '#000',
  }
}

/**
 * BasicBar
 */
export class BasicBar extends DatavEChartsComponent {
  config = {
    global: {
      fontFamily: 'Microsoft Yahei',
      innerPadding: 30,
      outerPadding: 60,
      barColor: 'rgba(255, 255, 255, 0.1)',
      margin: {
        top: 20,
        bottom: 30,
        left: 20,
        right: 10,
      },
    },
    label: {
      show: false,
      position: 'top',
      textStyle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 'normal',
      },
      offsetX: 0,
      offsetY: 0,
    },
    xAxis: {
      show: true,
      textStyle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 'normal',
      },
      label: {
        margin: 8,
      },
      axisLine: {
        show: true,
        color: 'rgba(255, 255, 255, 0.5)',
      },
      axisTick: {
        show: true,
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    yAxis: {
      show: true,
      textStyle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 'normal',
      },
      label: {
        min: 'auto',
        max: 'auto',
        unit: '',
        amount: 5,
        margin: 8,
      },
      axisLine: {
        show: true,
        color: 'rgba(255, 255, 255, 0.5)',
      },
      axisTick: {
        show: true,
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    series: [new BasicBarSeries('系列1')],
    animation: {
      enabled: true,
      duration: 1000,
      easing: 'cubicOut',
      delay: 0,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BasicBar', { w: 400, h: 200 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('x', { description: '类目' }),
      createField('y', { description: '值' }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: '基本柱状图接口',
    })

    this.apiData = initApiData(this.id)

    this.events = {}
    this.actions = {}
    return this
  }

  async loadData() {
    try {
      const path = 'bar/basic-bar'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default BasicBar
