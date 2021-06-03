export enum DataSourceType {
  /**
   * 静态数据
   */
  static = 'static',
  /**
   * api
   */
  api = 'api',
}

export enum ApiStatus {
  loading = 'loading',
  success = 'success',
  failed = 'failed',
  notfound = 'notfound',
  completed='completed',
  incomplete='incomplete'
}
