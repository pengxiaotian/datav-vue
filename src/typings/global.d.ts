import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'

declare global {
  const __DEV__: boolean

  interface Window {
    $message: MessageApiInjection
  }
}
