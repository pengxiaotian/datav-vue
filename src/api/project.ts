import request from '@/utils/request'

export function getProjects() {
  return request.get('/project')
}

export function getProject(id: number) {
  return request.get(`/project/${id}`)
}

export function createProject(data: any) {
  return request.post('/project', data)
}

export function updateProjectName(id: number, name: string) {
  return request.put(`/project/${id}/name`, { name })
}

export function deleteProject(id: number) {
  return request.delete(`/project/${id}`)
}

export function moveProject(id: number, fromId: number, toId: number) {
  return request.put(`/project/${id}/group`, { fromId, toId })
}

export function copyProject(id: number) {
  return request.post(`/project/${id}/copy`)
}

export function createProjectGroup(data: any) {
  return request.post('/project/group', data)
}

export function deleteProjectGroup(id: number) {
  return request.delete(`/project/group/${id}`)
}

export function updateProjectGroupName(id: number, name: string) {
  return request.put(`/project/group/${id}/name`, { name })
}

export function getMockTemplates() {
  return request.get('/project/template')
}

export function getPublishInfo(id: number) {
  return request.get(`/project/${id}/publish`)
}

export function publishApp(id: number, data: any) {
  return request.post(`/project/${id}/publish`, data)
}

export function getShareUrl(id: number) {
  return `${window.location.origin}/share/#/screen/${id}`
}
