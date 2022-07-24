export interface BlueprintEvent {
  /**
   * 请求数据接口
   */
  requestData?: Function
}

export type BlueprintEventType = keyof BlueprintEvent
