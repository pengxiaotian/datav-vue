import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  createField, setApiConfig, setApiData,
} from '@/components/data-source'

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

  events: Record<string, any> = {}

  constructor() {
    super('DatePicker', { w: 250, h: 50 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('date', { description: '默认日期', optional: true }),
    ]

    this.apis = setApiConfig({} as any, 'source', {
      fields: Object.assign({}, ...fields),
    })

    this.apiData = setApiData(this.id, {} as any, 'source', {})

    this.events = {}

    return this
  }
}

export default DatePicker
