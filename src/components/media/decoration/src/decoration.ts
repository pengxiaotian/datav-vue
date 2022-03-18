import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/_models/data-source'
import { DataEventConfig } from '@/components/_models/data-event'

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

export const presetImages: {
  [key: string]: {
    url: string
    css: Record<string, string>
  }
} = {
  gif1: {
    url: 'https://img.alicdn.com/tps/TB1tFMtPXXXXXXyXpXXXXXXXXXX-1920-1080.gif',
    css: {
      'background-position': 'left bottom',
    },
  },
  gif2: {
    url: 'https://img.alicdn.com/tps/TB1Pg3pPXXXXXcxXpXXXXXXXXXX-1920-1080.gif',
    css: {
      'background-position': 'center',
    },
  },
  gif3: {
    url: 'https://img.alicdn.com/tps/TB1XLAgPXXXXXbCXFXXXXXXXXXX-1080-824.gif',
    css: {
      'background-position': 'right top',
    },
  },
  gif4: {
    url: 'https://img.alicdn.com/tps/TB1LArQPXXXXXcLapXXXXXXXXXX-1080-824.gif',
    css: {
      'background-position': 'right bottom',
    },
  },
  gif5: {
    url: 'https://img.alicdn.com/tps/TB18er0PXXXXXXwapXXXXXXXXXX-1920-1080.gif',
    css: {
      'background-position': 'left top',
    },
  },
  gif6: {
    url: 'https://img.alicdn.com/tps/TB12FP6PXXXXXczXVXXXXXXXXXX-1626-356.gif',
    css: {
      'background-position': 'center',
    },
  },
  gif7: {
    url: 'https://img.alicdn.com/tps/TB1ZXD8PXXXXXX1aXXXXXXXXXXX-94-1461.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif8: {
    url: 'https://img.alicdn.com/tps/TB1Z8MHPFXXXXacaXXXXXXXXXXX-500-54.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif9: {
    url: 'https://img.alicdn.com/tps/TB1tIIKPFXXXXXIXVXXXXXXXXXX-500-64.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif10: {
    url: 'https://img.alicdn.com/tps/TB10bUCPFXXXXajapXXXXXXXXXX-782-259.gif',
    css: {
      'background-size': 'contain',
      'background-position': 'left top',
    },
  },
  gif11: {
    url: 'https://img.alicdn.com/tfs/TB15JPjtMTqK1RjSZPhXXXfOFXa-280-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif12: {
    url: 'https://img.alicdn.com/tfs/TB1_PYmtMHqK1RjSZJnXXbNLpXa-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif13: {
    url: 'https://img.alicdn.com/tfs/TB16KbftSzqK1RjSZPxXXc4tVXa-800-171.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif14: {
    url: 'https://img.alicdn.com/tfs/TB1Zo2ntQvoK1RjSZFwXXciCFXa-800-103.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif15: {
    url: 'https://img.alicdn.com/tfs/TB1R7fqtMHqK1RjSZFkXXX.WFXa-800-143.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif16: {
    url: 'https://img.alicdn.com/tfs/TB1A26ntHvpK1RjSZFqXXcXUVXa-800-154.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif17: {
    url: 'https://img.alicdn.com/tfs/TB19EDvtNYaK1RjSZFnXXa80pXa-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif18: {
    url: 'https://img.alicdn.com/tfs/TB115YhtMDqK1RjSZSyXXaxEVXa-800-143.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif19: {
    url: 'https://img.alicdn.com/tfs/TB1F3bqtQzoK1RjSZFlXXai4VXa-113-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif20: {
    url: 'https://img.alicdn.com/tfs/TB1pZLmtFzqK1RjSZFCXXbbxVXa-840-700.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif21: {
    url: 'https://img.alicdn.com/tfs/TB1NT_ltFzqK1RjSZFoXXbfcXXa-368-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif22: {
    url: 'https://img.alicdn.com/tfs/TB1YUbltFzqK1RjSZFoXXbfcXXa-800-103.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif23: {
    url: 'https://img.alicdn.com/tfs/TB1AgnntQvoK1RjSZPfXXXPKFXa-800-86.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif24: {
    url: 'https://img.alicdn.com/tfs/TB1mtbmtFzqK1RjSZFCXXbbxVXa-456-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif25: {
    url: 'https://img.alicdn.com/tfs/TB1eOYKtNnaK1RjSZFtXXbC2VXa-132-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif26: {
    url: 'https://img.alicdn.com/tfs/TB101HktSzqK1RjSZFHXXb3CpXa-184-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif27: {
    url: 'https://img.alicdn.com/tfs/TB1t_PftRLoK1RjSZFuXXXn0XXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif28: {
    url: 'https://img.alicdn.com/tfs/TB1m5_KtNnaK1RjSZFtXXbC2VXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif29: {
    url: 'https://img.alicdn.com/tfs/TB1KtritHPpK1RjSZFFXXa5PpXa-254-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif30: {
    url: 'https://img.alicdn.com/tfs/TB1oujktMHqK1RjSZFPXXcwapXa-500-500.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif31: {
    url: 'https://img.alicdn.com/tfs/TB1WxTntQvoK1RjSZPfXXXPKFXa-1000-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif32: {
    url: 'https://img.alicdn.com/tfs/TB1aQPltMHqK1RjSZFgXXa7JXXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif33: {
    url: 'https://img.alicdn.com/tfs/TB1HYbwtNYaK1RjSZFnXXa80pXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif34: {
    url: 'https://img.alicdn.com/tfs/TB1dg2jtMTqK1RjSZPhXXXfOFXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif35: {
    url: 'https://img.alicdn.com/tfs/TB1Y6zntHvpK1RjSZFqXXcXUVXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif36: {
    url: 'https://img.alicdn.com/tfs/TB1.sLotQvoK1RjSZFwXXciCFXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif37: {
    url: 'https://img.alicdn.com/tfs/TB1OhvktMHqK1RjSZFPXXcwapXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif38: {
    url: 'https://img.alicdn.com/tfs/TB1aU_itNTpK1RjSZFGXXcHqFXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif39: {
    url: 'https://img.alicdn.com/tfs/TB1iFrotQPoK1RjSZKbXXX1IXXa-1200-1200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif40: {
    url: 'https://img.alicdn.com/tfs/TB1uSTjtH2pK1RjSZFsXXaNlXXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif41: {
    url: 'https://img.alicdn.com/tfs/TB1nXLptQvoK1RjSZFDXXXY3pXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif42: {
    url: 'https://img.alicdn.com/tfs/TB1ZMDntHrpK1RjSZTEXXcWAVXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif43: {
    url: 'https://img.alicdn.com/tfs/TB1MtTmtFzqK1RjSZFoXXbfcXXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif44: {
    url: 'https://img.alicdn.com/tfs/TB1UffotQvoK1RjSZFwXXciCFXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif45: {
    url: 'https://img.alicdn.com/tfs/TB1LdnitSzqK1RjSZFLXXcn2XXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif46: {
    url: 'https://img.alicdn.com/tfs/TB1o.fKtNnaK1RjSZFtXXbC2VXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif47: {
    url: 'https://img.alicdn.com/tfs/TB19K_mtSzqK1RjSZFpXXakSXXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif48: {
    url: 'https://img.alicdn.com/tfs/TB1tefhtNTpK1RjSZR0XXbEwXXa-300-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif49: {
    url: 'https://img.alicdn.com/tfs/TB1MAYktSzqK1RjSZFHXXb3CpXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif50: {
    url: 'https://img.alicdn.com/tfs/TB1VefitSzqK1RjSZFLXXcn2XXa-800-65.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif51: {
    url: 'https://img.alicdn.com/tfs/TB1iirptNTpK1RjSZFMXXbG_VXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif52: {
    url: 'https://img.alicdn.com/tfs/TB1lFbktH2pK1RjSZFsXXaNlXXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif53: {
    url: 'https://img.alicdn.com/tfs/TB1m7zmtFzqK1RjSZFCXXbbxVXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif54: {
    url: 'https://img.alicdn.com/tfs/TB1Df6mtFzqK1RjSZFoXXbfcXXa-800-200.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
  gif55: {
    url: 'https://img.alicdn.com/tfs/TB1sg6mtSzqK1RjSZFpXXakSXXa-800-800.png',
    css: {
      'background-position': 'center',
      'background-size': 'contain',
    },
  },
}

export default Decoration
