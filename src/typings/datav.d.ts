import type { ComponentInternalInstance } from 'vue'

export declare interface DataVComponentInternalInstance extends ComponentInternalInstance {
  // ------公共动作------
  /**
   * 请求数据接口
   */
  $DATAV_requestData: Function
}
