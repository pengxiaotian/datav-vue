import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/_models/data-source'
import { DataEventConfig } from '@/components/_models/data-event'
import { BorderImage } from '@/components/_models/border-image'

/**
 * Decoration
 */
export class Decoration extends DatavComponent {
  config = {
    global: {
      img: 'gif1',
      opacity: 1,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('Decoration', { w: 200, h: 200 })

    this.initData()
  }

  initData() {
    this.apis = {}
    this.apiData = {}
    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {}
}

export default Decoration

export const presetImages: BorderImage[] = [
  {
    id: 'gif1',
    name: 'gif1',
    src: 'https://files.pengxiaotian.com/deco/gif1-1920-1080.gif',
    css: {
      'background-position': 'left bottom',
    },
  },
  {
    id: 'gif2',
    name: 'gif2',
    src: 'https://files.pengxiaotian.com/deco/gif2-1920-1080.gif',
    css: {
      'background-position': 'center',
    },
  },
  {
    id: 'gif3',
    name: 'gif3',
    src: 'https://files.pengxiaotian.com/deco/gif3-1080-824.gif',
    css: {
      'background-position': 'right top',
    },
  },
  {
    id: 'gif4',
    name: 'gif4',
    src: 'https://files.pengxiaotian.com/deco/gif4-1080-824.gif',
    css: {
      'background-position': 'right bottom',
    },
  },
  {
    id: 'gif5',
    name: 'gif5',
    src: 'https://files.pengxiaotian.com/deco/gif5-1920-1080.gif',
    css: {
      'background-position': 'left top',
    },
  },
  {
    id: 'gif6',
    name: 'gif6',
    src: 'https://files.pengxiaotian.com/deco/gif6-1626-356.gif',
    css: {
      'background-position': 'center',
    },
  },
  {
    id: 'gif7',
    name: 'gif7',
    src: 'https://files.pengxiaotian.com/deco/gif7-94-1461.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  {
    id: 'gif8',
    name: 'gif8',
    src: 'https://files.pengxiaotian.com/deco/gif8-500-54.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  {
    id: 'gif9',
    name: 'gif9',
    src: 'https://files.pengxiaotian.com/deco/gif9-500-64.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  {
    id: 'gif10',
    name: 'gif10',
    src: 'https://files.pengxiaotian.com/deco/gif10-782-259.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  {
    id: 'gif11',
    name: 'gif11',
    src: 'https://files.pengxiaotian.com/deco/gif11-280-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif12',
    name: 'gif12',
    src: 'https://files.pengxiaotian.com/deco/gif12-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif13',
    name: 'gif13',
    src: 'https://files.pengxiaotian.com/deco/gif13-800-171.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif14',
    name: 'gif14',
    src: 'https://files.pengxiaotian.com/deco/gif14-800-103.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif15',
    name: 'gif15',
    src: 'https://files.pengxiaotian.com/deco/gif15-800-143.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif16',
    name: 'gif16',
    src: 'https://files.pengxiaotian.com/deco/gif16-800-154.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif17',
    name: 'gif17',
    src: 'https://files.pengxiaotian.com/deco/gif17-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif18',
    name: 'gif18',
    src: 'https://files.pengxiaotian.com/deco/gif18-800-143.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif19',
    name: 'gif19',
    src: 'https://files.pengxiaotian.com/deco/gif19-113-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif20',
    name: 'gif20',
    src: 'https://files.pengxiaotian.com/deco/gif20-840-700.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif21',
    name: 'gif21',
    src: 'https://files.pengxiaotian.com/deco/gif21-368-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif22',
    name: 'gif22',
    src: 'https://files.pengxiaotian.com/deco/gif22-800-103.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif23',
    name: 'gif23',
    src: 'https://files.pengxiaotian.com/deco/gif23-800-86.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif24',
    name: 'gif24',
    src: 'https://files.pengxiaotian.com/deco/gif24-456-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif25',
    name: 'gif25',
    src: 'https://files.pengxiaotian.com/deco/gif25-132-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif26',
    name: 'gif26',
    src: 'https://files.pengxiaotian.com/deco/gif26-184-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif27',
    name: 'gif27',
    src: 'https://files.pengxiaotian.com/deco/gif27-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif28',
    name: 'gif28',
    src: 'https://files.pengxiaotian.com/deco/gif28-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif29',
    name: 'gif29',
    src: 'https://files.pengxiaotian.com/deco/gif29-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif30',
    name: 'gif30',
    src: 'https://files.pengxiaotian.com/deco/gif30-500-500.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif31',
    name: 'gif31',
    src: 'https://files.pengxiaotian.com/deco/gif31-1000-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif32',
    name: 'gif32',
    src: 'https://files.pengxiaotian.com/deco/gif32-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif33',
    name: 'gif33',
    src: 'https://files.pengxiaotian.com/deco/gif33-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif34',
    name: 'gif34',
    src: 'https://files.pengxiaotian.com/deco/gif34-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif35',
    name: 'gif35',
    src: 'https://files.pengxiaotian.com/deco/gif35-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif36',
    name: 'gif36',
    src: 'https://files.pengxiaotian.com/deco/gif36-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif37',
    name: 'gif37',
    src: 'https://files.pengxiaotian.com/deco/gif37-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif38',
    name: 'gif38',
    src: 'https://files.pengxiaotian.com/deco/gif38-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif39',
    name: 'gif39',
    src: 'https://files.pengxiaotian.com/deco/gif39-1200-1200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif40',
    name: 'gif40',
    src: 'https://files.pengxiaotian.com/deco/gif40-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif41',
    name: 'gif41',
    src: 'https://files.pengxiaotian.com/deco/gif41-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif42',
    name: 'gif42',
    src: 'https://files.pengxiaotian.com/deco/gif42-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif43',
    name: 'gif43',
    src: 'https://files.pengxiaotian.com/deco/gif43-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif44',
    name: 'gif44',
    src: 'https://files.pengxiaotian.com/deco/gif44-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif45',
    name: 'gif45',
    src: 'https://files.pengxiaotian.com/deco/gif45-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif46',
    name: 'gif46',
    src: 'https://files.pengxiaotian.com/deco/gif46-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif47',
    name: 'gif47',
    src: 'https://files.pengxiaotian.com/deco/gif47-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif48',
    name: 'gif48',
    src: 'https://files.pengxiaotian.com/deco/gif48-300-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif49',
    name: 'gif49',
    src: 'https://files.pengxiaotian.com/deco/gif49-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif50',
    name: 'gif50',
    src: 'https://files.pengxiaotian.com/deco/gif50-800-65.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif51',
    name: 'gif51',
    src: 'https://files.pengxiaotian.com/deco/gif51-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif52',
    name: 'gif52',
    src: 'https://files.pengxiaotian.com/deco/gif52-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif53',
    name: 'gif53',
    src: 'https://files.pengxiaotian.com/deco/gif53-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif54',
    name: 'gif54',
    src: 'https://files.pengxiaotian.com/deco/gif54-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  {
    id: 'gif55',
    name: 'gif55',
    src: 'https://files.pengxiaotian.com/deco/gif55-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
]
