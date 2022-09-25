import { ComType, DatavComponent } from '@/components/_models/datav-component'
import {
  ApiType,
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField, createFieldConfig } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * China2dArea
 */
export class China2dArea extends DatavComponent {
  config = {
    defaultStyle: {
      fill: {
        minFillColor: '#3dcfff',
        maxFillColor: '#273bff',
        fillColor: 'rgba(77, 77, 77, 0.5)',
      },
      stroke: {
        color: 'rgba(255, 255, 255, 0.2)',
        weight: 1,
        dashArray: '',
      },
    },
    labelStyle: {
      fontFamily: 'Microsoft Yahei',
      fontWeight: 'normal',
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.6)',
      shadowColor: 'rgba(0, 0, 0, 0.85)',
    },
    tooltip: {
      show: true,
      infoField: false,
      eventType: 'click',
      styleType: 'parent',
      textStyle: {
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        fontSize: 14,
        color: '#fff',
      },
      lineHeight: 1.4,
      borderRadius: 5,
      padding: {
        bottom: 10,
        left: 20,
        right: 20,
        top: 10,
      },
      bgColor: 'rgba(6, 75, 199, 0.8)',
    },
    interactive:{
      isHover: {
        show: true,
        fillColor: 'rgba(0,192,255,0.6)',
        strokeColor: 'rgba(25,254,48,0.6)',
        weight: 6,
      },
      clickZoom: {
        show: true,
        zoomPad: 1.5,
      },
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('China2dArea', {}, ComType.subCom)

    this.initData()
  }

  initData() {
    const fields = [
      createField('area_id', { description: '区域编号' }),
      createField('name', {
        type: 'string',
        description: '名称',
        optional: true,
      }),
      createField('value', {
        type: 'number',
        description: '值',
        optional: true,
      }),
      createField('info', {
        type: 'string',
        description: '弹框内容',
        optional: true,
      }),
    ]

    setApiConfig(this.apis, { description: '地理边界geojson数据接口' })
    setApiConfig(this.apis, {
      fields: Object.assign({}, ...fields),
      description: '热力值数据接口',
    }, 'mappingData')

    setApiData(this.apiData,  this.id, {
      type: ApiType.api,
      config: {
        api: 'https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json',
      },
    })
    setApiData(this.apiData, this.id, {}, 'mappingData')

    const fileConfig = createFieldConfig({ description: '区域关联id' })
    this.events = {
      click: {
        description: '点击区域时',
        fields: {
          area_id: { ...fileConfig },
        },
      },
      mouseout: {
        description: '鼠标移出区域触发',
        fields: {
          area_id: { ...fileConfig },
        },
      },
      mouseover: {
        description: '鼠标移入区域触发',
        fields: {
          area_id: { ...fileConfig },
        },
      },
    }
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      const path = 'map/china2d-area'
      const res = await getStaticData(this.id, path)
      this.apiData.mappingData.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default China2dArea
