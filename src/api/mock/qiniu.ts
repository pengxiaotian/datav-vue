import Mock from 'mockjs'
import adapter from '@/utils/mock-adapter'

adapter.onGet('/qiniu/upload/token')
  .reply(200, Mock.mock({
    'code': 0,
    'message': 'ok',
    'data': 'fW_XldFDya_pXoz4Sv5V4lT7E7xnTLQe0kjgvk30:dIqJxcY6MPwMJksJkYp58hHa8VY=:eyJzY29wZSI6Im5ld2ZpbGVzZXJ2ZXItcHVibGljLXRlc3QiLCJkZWFkbGluZSI6MTU3NjA2MDk4N30=',
  }))
