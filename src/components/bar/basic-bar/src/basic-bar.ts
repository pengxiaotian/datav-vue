import { DatavEChartsComponent, DatavChartSeries } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'

export class BasicBarSeries extends DatavChartSeries {
  constructor(name: string) {
    super(name, 'bar')
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
    },
    margin: {
      top: 20,
      bottom: 30,
      left: 40,
      right: 10,
    },
    label: {
      show: false,
      position: 'top',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 12,
      fontWeight: 'normal',
      offsetX: 0,
      offsetY: 0,
    },
    xAxis: {
      show: true,
      textarea: {
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
      },
    },
    yAxis: {
      show: true,
      textarea: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 'normal',
      },
      label: {
        category: 'value',
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
      },
    },
    series: {
      series: [] as BasicBarSeries[],
    },
  }

  apis: ApiConfigMap
  apiData: ApiDataConfigMap

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BasicBar', { w: 400, h: 200 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '', optional: true }),
    ]

    this.apis = setApiConfig({}, 'source', {
      fields: Object.assign({}, ...fields),
      description: '基本柱状图接口',
    })

    this.apiData = setApiData(this.id, {}, 'source', {
      value: 'api data',
    })

    this.events = {}

    this.actions = {}

    return this
  }
}

export default BasicBar
