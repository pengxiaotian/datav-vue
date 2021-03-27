import request from '@/utils/request'

export function getScreen(id: number) {
  return request.get(`/screen/${id}`)
}
