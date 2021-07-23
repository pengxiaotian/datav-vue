import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/data-source'
import { DataEventConfig } from '@/components/data-event'

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

  apis: ApiConfigMap
  apiData: ApiDataConfigMap

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('Decoration', { w: 200, h: 200 })

    this.initData()
  }

  initData() {
    this.apis = {} as ApiConfigMap
    this.apiData = {} as ApiDataConfigMap
    this.events = {}
    this.actions = {}

    return this
  }
}

export const presetImages: {
  [key: string]: {
    url: string
    css: Record<string, string>
  }
} = {
  gif1: {
    url: 'https://files.pengxiaotian.com/deco/gif1-1920-1080.gif',
    css: {
      'background-position': 'left bottom',
    },
  },
  gif2: {
    url: 'https://files.pengxiaotian.com/deco/gif2-1920-1080.gif',
    css: {
      'background-position': 'center',
    },
  },
  gif3: {
    url: 'https://files.pengxiaotian.com/deco/gif3-1080-824.gif',
    css: {
      'background-position': 'right top',
    },
  },
  gif4: {
    url: 'https://files.pengxiaotian.com/deco/gif4-1080-824.gif',
    css: {
      'background-position': 'right bottom',
    },
  },
  gif5: {
    url: 'https://files.pengxiaotian.com/deco/gif5-1920-1080.gif',
    css: {
      'background-position': 'left top',
    },
  },
  gif6: {
    url: 'https://files.pengxiaotian.com/deco/gif6-1626-356.gif',
    css: {
      'background-position': 'center',
    },
  },
  gif7: {
    url: 'https://files.pengxiaotian.com/deco/gif7-94-1461.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif8: {
    url: 'https://files.pengxiaotian.com/deco/gif8-500-54.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif9: {
    url: 'https://files.pengxiaotian.com/deco/gif9-500-64.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif10: {
    url: 'https://files.pengxiaotian.com/deco/gif10-782-259.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif11: {
    url: 'https://files.pengxiaotian.com/deco/gif11-280-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif12: {
    url: 'https://files.pengxiaotian.com/deco/gif12-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif13: {
    url: 'https://files.pengxiaotian.com/deco/gif13-800-171.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif14: {
    url: 'https://files.pengxiaotian.com/deco/gif14-800-103.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif15: {
    url: 'https://files.pengxiaotian.com/deco/gif15-800-143.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif16: {
    url: 'https://files.pengxiaotian.com/deco/gif16-800-154.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif17: {
    url: 'https://files.pengxiaotian.com/deco/gif17-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif18: {
    url: 'https://files.pengxiaotian.com/deco/gif18-800-143.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif19: {
    url: 'https://files.pengxiaotian.com/deco/gif19-113-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif20: {
    url: 'https://files.pengxiaotian.com/deco/gif20-840-700.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif21: {
    url: 'https://files.pengxiaotian.com/deco/gif21-368-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif22: {
    url: 'https://files.pengxiaotian.com/deco/gif22-800-103.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif23: {
    url: 'https://files.pengxiaotian.com/deco/gif23-800-86.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif24: {
    url: 'https://files.pengxiaotian.com/deco/gif24-456-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif25: {
    url: 'https://files.pengxiaotian.com/deco/gif25-132-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif26: {
    url: 'https://files.pengxiaotian.com/deco/gif26-184-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif27: {
    url: 'https://files.pengxiaotian.com/deco/gif27-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif28: {
    url: 'https://files.pengxiaotian.com/deco/gif28-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif29: {
    url: 'https://files.pengxiaotian.com/deco/gif29-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif30: {
    url: 'https://files.pengxiaotian.com/deco/gif30-500-500.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif31: {
    url: 'https://files.pengxiaotian.com/deco/gif31-1000-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif32: {
    url: 'https://files.pengxiaotian.com/deco/gif32-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif33: {
    url: 'https://files.pengxiaotian.com/deco/gif33-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif34: {
    url: 'https://files.pengxiaotian.com/deco/gif34-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif35: {
    url: 'https://files.pengxiaotian.com/deco/gif35-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif36: {
    url: 'https://files.pengxiaotian.com/deco/gif36-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif37: {
    url: 'https://files.pengxiaotian.com/deco/gif37-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif38: {
    url: 'https://files.pengxiaotian.com/deco/gif38-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif39: {
    url: 'https://files.pengxiaotian.com/deco/gif39-1200-1200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif40: {
    url: 'https://files.pengxiaotian.com/deco/gif40-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif41: {
    url: 'https://files.pengxiaotian.com/deco/gif41-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif42: {
    url: 'https://files.pengxiaotian.com/deco/gif42-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif43: {
    url: 'https://files.pengxiaotian.com/deco/gif43-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif44: {
    url: 'https://files.pengxiaotian.com/deco/gif44-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif45: {
    url: 'https://files.pengxiaotian.com/deco/gif45-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif46: {
    url: 'https://files.pengxiaotian.com/deco/gif46-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif47: {
    url: 'https://files.pengxiaotian.com/deco/gif47-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif48: {
    url: 'https://files.pengxiaotian.com/deco/gif48-300-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif49: {
    url: 'https://files.pengxiaotian.com/deco/gif49-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif50: {
    url: 'https://files.pengxiaotian.com/deco/gif50-800-65.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif51: {
    url: 'https://files.pengxiaotian.com/deco/gif51-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif52: {
    url: 'https://files.pengxiaotian.com/deco/gif52-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif53: {
    url: 'https://files.pengxiaotian.com/deco/gif53-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif54: {
    url: 'https://files.pengxiaotian.com/deco/gif54-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif55: {
    url: 'https://files.pengxiaotian.com/deco/gif55-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
}

export default Decoration
