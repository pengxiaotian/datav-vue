import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * CarouselTableSeries
 */
export class CarouselTableSeries {
  columnName: string
  displayName: string

  width = 20
  dataType = 'text'
  widthPercent = 50
  margin = {
    top: 0,
    bottom: 10,
    left: 0,
    right: 10,
  }
  isBr = false
  textAlign = 'left'
  textStyle = {
    fontFamily: 'Microsoft Yahei',
    fontWeight: 'normal',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  }

  constructor(columnName: string, displayName: string) {
    this.columnName = columnName
    this.displayName = displayName
  }
}

/**
 * CarouselTable
 */
export class CarouselTable extends DatavComponent {
  config = {
    global: {
      rowCount: 5,
      isLoop: true,
      fontFamily: 'arial',
      animation: {
        mode: 'bottom',
        duration: 2,
        singleStop: true,
      },
      highLight: {
        show: true,
        isOrder: true,
        hlIndex: '3,4',
        hlStyle: {
          textStyle: {
            fontFamily: 'arial',
            fontSize: 12,
            color: '#fff',
            fontWeight: 'normal',
          },
          bgColor: 'rgb(154, 205, 50)',
          border: {
            width: 1,
            style: 'solid',
            color: '#f00',
          },
        },
      },
      ifRowHidden: true,
      textAnimate: {
        ifRun: true,
        isSpeed: true,
        animateDur: 2,
        speedRate: 0.03,
      },
      defaultImg: 'https://img.alicdn.com/tfs/TB1Bk0IhbGYBuNjy0FoXXciBFXa-99-65.png',
    },
    header: {
      show: true,
      heightPercent: 20,
      bgColor: 'rgb(10, 115, 255)',
      textStyle: {
        textAlign: 'left',
        fontFamily: 'arial',
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'normal',
      },
    },
    row: {
      oddBGColor: 'rgb(10, 115, 255)',
      evenBGColor: 'rgb(36, 130, 255)',
    },
    idList: {
      show: true,
      bgColor: 'rgb(44, 156, 255)',
      width: 12,
      radius: 60,
      textStyle: {
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        fontSize: 10,
        color: '#ffffff',
      },
    },
    series: [],
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('CarouselTable', { w: 200, h: 200 })

    this.initData()
  }

  initData() {
    setApiConfig(this)
    setApiData(this)

    this.events = {}
    this.actions = {}

    this.config.series.push(
      new CarouselTableSeries('area', '地区'),
      new CarouselTableSeries('pv', '流量(pv)'),
      new CarouselTableSeries('attribute', '用户行为特征'),
    )

    return this
  }

  async loadData() {
    try {
      const path = 'table/carousel-table'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default CarouselTable
