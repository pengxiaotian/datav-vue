import request from '@/utils/request'

export function getComs(projectId: number) {
  return request.get(`/coms?projectId=${projectId}`)
}
