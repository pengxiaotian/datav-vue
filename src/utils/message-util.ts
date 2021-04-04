import { ElMessage, ElMessageBox } from 'element-plus'

type RetDataType = 'string' | 'json' | 'object'

interface RetData {
  code: number
  message: string
}

const parseError = (error: any, retDataType: RetDataType) => {
  const ret: RetData = {
    code: -1,
    message: 'error',
  }

  const res = error.response || { data: error }
  if (res && res.data) {
    const { status, code, message } = res.data
    ret.code = status || code || -1
    ret.message = message || res.data
  }

  if (retDataType === 'string') {
    return ret.message
  }

  if (retDataType === 'json') {
    return JSON.stringify(ret)
  }

  return ret
}

export const MessageUtil = {
  format(error: any) {
    return parseError(error, 'string') as string
  },
  formatJson(error: any) {
    return parseError(error, 'json') as string
  },
  formatObject(error: any) {
    return parseError(error, 'object') as RetData
  },

  success(message: string, showClose = true) {
    ElMessage({
      type: 'success',
      showClose,
      message,
    })
  },

  warning(message: string, showClose = true) {
    ElMessage({
      type: 'warning',
      showClose,
      message,
    })
  },

  error(message: string, showClose = true) {
    ElMessage({
      type: 'error',
      showClose,
      message,
    })
  },
}

export const MessageBoxUtil = {
  confirm(message: string, callback: Function, title = '') {
    ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
    })
      .then(() => {
        callback()
      })
      .catch(() => {})
  },
  async confirmAsync(message: string, callback: Function, options?: {
    title?: string
    success?: Function
    error?: Function
  }) {
    const opt = {
      title: '',
      ...(options || {}),
    }
    await ElMessageBox.confirm(message, opt.title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'

          try {
            await callback()
            done()
          } catch (error) {
            MessageUtil.error(MessageUtil.format(error))
          } finally {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
          }
        } else {
          done()
        }
      },
    })
      .then(() => {
        if (typeof opt.success === 'function') {
          opt.success()
        }
      })
      .catch(() => {
        if (typeof opt.error === 'function') {
          opt.error()
        }
      })
  },
}
