import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'

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

  apis: ApiConfigMap
  apiData: ApiDataConfigMap

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

    this.apis = setApiConfig({}, 'source', {
      fields: Object.assign({}, ...fields),
    })

    this.apiData = setApiData(this.id, {}, 'source', {})

    this.events = {
      changed: {
        type: 'string',
        description: '当日期变化时',
        fields: Object.assign({}, ...fields),
      },
    }

    this.actions = {}

    return this
  }
}

export default DatePicker
