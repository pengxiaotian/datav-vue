import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

export const DatePickerEvent = {
  changed: 'changed',
}

/**
 * DatePicker
 */
export class DatePicker extends DatavComponent {
  config = {
    global: {
      date: '2021-07-01',
      fontFamily: 'Microsoft Yahei',
    },
    input: {
      size: {
        width: 180,
        height: 30,
      },
      border: {
        width: 1,
        color: '#ccc',
        radius: 0,
      },
      bgColor: '#01becc',
      fontSize: 18,
      fontColor: '#fff',
      separator: '-',
      pos: 'left',
    },
    calendar: {
      fontSize: 14,
      fontColor: '#fff',
      bgColor: '#126973',
      selectBGColor: '#01becc',
      border: {
        width: 1,
        color: '#ccc',
        radius: 5,
      },
      paddingBorder: {
        width: 1,
        color: '#ccc',
        padding: 6,
      },
      select: {
        time: 2,
        today: 4,
      },
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('DatePicker', { w: 250, h: 50 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('date', { description: '默认日期', optional: true }),
    ]

    setApiConfig(this, {
      fields: Object.assign({}, ...fields),
    })

    setApiData(this)

    this.events = {
      [DatePickerEvent.changed]: {
        description: '当日期变化时',
        fields: Object.assign({}, ...fields),
      },
    }

    this.actions = {}

    return this
  }

  async loadData() {
    try {
      const path = 'other/date-picker'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default DatePicker
