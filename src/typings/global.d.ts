import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'

declare global {
  const __DEV__: boolean

  interface Window {
    $message: MessageApiInjection
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentInternalInstance {
    /**
     * 请求数据接口
     */
    $DATAV_requestData?: Function
  }
}
