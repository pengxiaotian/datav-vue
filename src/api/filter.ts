import request from '@/utils/request'

export function getFilters(projectId: number) {
  return request.get(`/project/${projectId}/filter`)
}

export function createFilter(projectId: number, data: any) {
  return request.post(`/project/${projectId}/filter`, data)
}

export function updateFilter(projectId: number, data: any) {
  return request.put(`/project/${projectId}/filter/${data.id}`, data)
}

export function deleteFilter(projectId: number, id: number) {
  return request.delete(`/project/${projectId}/filter/${id}`)
}
