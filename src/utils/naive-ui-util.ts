import { createDiscreteApi } from 'naive-ui'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import { themeOverrides } from '@/styles/themes/naive-ui-theme-overrides'

let nMessageUtil: MessageApiInjection = null

export const useMessageUtil = () => {
  if (!nMessageUtil) {
    const { message } = createDiscreteApi(['message'], {
      configProviderProps: {
        themeOverrides,
      },
    })
    nMessageUtil = message
  }
  return nMessageUtil
}
