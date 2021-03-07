import request from '@/utils/request'

export function login(username: string, password: string) {
  return request.post('/user/login', { username, password })
}

export function logout() {
  return request.post('/user/logout')
}

export function getInfo() {
  return request.get('/user/info')
}
