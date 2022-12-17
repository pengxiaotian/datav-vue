import { DatavEChartsComponent, DatavChartSeries } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'
import { EChartEasing } from '@/components/_models/echarts-animation'

export class BasicLineSeries extends DatavChartSeries {
  constructor(name: string) {
    super('line', name)
  }

  line = {
    color: '#34FFF5',
    style: 'solid',
    width: 1,
    opacity: 1,
    smooth: 0.5,
  }

  point = {
    icon: 'roundRect',
    color: '#34FFF5',
    borderColor: 'rgba(0, 0, 0, 0.44)',
    borderWidth: 1,
    borderType: 'solid',
    opacity: 1,
  }

  label = {
    show: false,
    field: 'y',
    valueFormat: 'auto',
    describe: {
      prefix: '',
      suffix: '',
    },
    offset: {
      x: 0,
      y: 0,
    },
    rotate: 0,
    textStyle: {
      fontSize: 12,
      color: '#ddd',
      fontWeight: 'normal',
    },
    stroke: {
      color: '#000',
      width: 0,
    },
  }
}

/**
 * BasicLine
 */
export class BasicLine extends DatavEChartsComponent {
  config = {
    global: {
      fontFamily: 'Microsoft Yahei',
      margin: {
        top: 40,
        bottom: 50,
        left: 60,
        right: 30,
      },
      connectNulls: false,
    },
    xAxis: {
      show: true,
      type: 'category',
      extent: {
        min: 'auto',
        max: 'auto',
      },
      boundaryGap: true,
      title: {
        show: true,
        name: 'X轴',
        location: 'center',
        display: {
          rotate: 0,
          offset: 20,
        },
        textStyle: {
          fontSize: 12,
          color: '#90a0ae',
          fontWeight: 'normal',
        },
      },
      axisLine: {
        show: true,
        type: 'solid',
        width: 1,
        color: 'rgba(255, 255, 255, 0.5)',
      },
      axisTick: {
        show: true,
        type: 'solid',
        width: 1,
        color: 'rgba(255, 255, 255, 0.5)',
      },
      axisLabel: {
        show: true,
        valueFormat: 'd',
        timeFormat: 'MM/DD',
        interval: 'auto',
        display: {
          rotate: 0,
          margin: 10,
        },
        align: 'center',
        textStyle: {
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: 'normal',
        },
      },
      grid: {
        show: true,
        line: {
          type: 'dashed',
          width: 1,
          color: 'rgba(233, 228, 228, 0.1)',
          dashedLength: 4,
          dashedSpace: 4,
        },
      },
    },
    yAxis: {
      show: true,
      type: 'value',
      extent: {
        min: 'auto',
        max: 'auto',
      },
      title: {
        show: false,
        name: 'Y轴',
        location: 'center',
        display: {
          rotate: 90,
          offset: 20,
        },
        textStyle: {
          fontSize: 12,
          color: '#90a0ae',
          fontWeight: 'normal',
        },
      },
      axisLine: {
        show: true,
        type: 'solid',
        width: 1,
        color: 'rgba(255, 255, 255, 0.5)',
      },
      axisTick: {
        show: true,
        type: 'solid',
        width: 1,
        color: 'rgba(255, 255, 255, 0.5)',
      },
      axisLabel: {
        show: true,
        valueFormat: 'auto',
        timeFormat: 'MM/DD',
        boundaryGap: 0,
        display: {
          rotate: 0,
          margin: 8,
        },
        align: 'right',
        textStyle: {
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: 'normal',
        },
      },
      grid: {
        show: true,
        line: {
          type: 'dashed',
          width: 1,
          color: 'rgba(233, 228, 228, 0.1)',
          dashedLength: 4,
          dashedSpace: 4,
        },
      },
    },
    tooltip: {
      show: true,
      triggerOn: 'mousemove',
      textStyle: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'normal',
      },
      background: {
        padding: {
          h: 5,
          v: 5,
        },
        color: 'rgba(0, 0, 0, 0.65)',
        borderColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
      },
      pointer: {
        show: true,
        line: {
          type: 'dashed',
          width: 1,
          color: '#f5dc69',
          dashedLength: 4,
          dashedSpace: 4,
        },
      },
    },
    legend: {
      show: true,
      position: 'top-center',
      orient: 'horizontal',
      textStyle: {
        fontSize: 12,
        color: '#90a0ae',
        fontWeight: 'normal',
      },
      symbol: {
        show: true,
        icon: 'auto',
        width: 25,
        height: 14,
        gap: 10,
      },
      page: {
        enabled: false,
        size: {
          width: 100,
          height: 100,
        },
        button: {
          size: 15,
          color: '#000',
          inactiveColor: '#000',
        },
        pageNumColor: '#90a0ae',
      },
    },
    series: [new BasicLineSeries('')],
    animation: {
      enabled: true,
      duration: 1000,
      easing: EChartEasing.cubicOut,
      delay: 0,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BasicLine', { w: 500, h: 300 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('x', { description: '类目' }),
      createField('y', { description: '值' }),
      createField('s', { description: '系列' }),
    ]

    setApiConfig(this, {
      fields: Object.assign({}, ...fields),
      description: '基本折线图接口',
    })

    setApiData(this)

    this.events = {
      click: {
        description: '当点击数据项时',
        fields: Object.assign({}, ...fields),
      },
    }
    this.actions = {}

    const series2 = new BasicLineSeries('')
    series2.line.color = '#30D9F1'
    series2.point.color = '#30D9F1'

    const series3 = new BasicLineSeries('')
    series3.line.color = '#2CB4ED'
    series3.point.color = '#2CB4ED'

    const series4 = new BasicLineSeries('')
    series4.line.color = '#288EE8'
    series4.point.color = '#288EE8'

    const series5 = new BasicLineSeries('')
    series5.line.color = '#2469E4'
    series5.point.color = '#2469E4'
    this.config.series.push(series2, series3, series4, series5)

    return this
  }

  async loadData() {
    try {
      const path = 'line/basic-line'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default BasicLine
