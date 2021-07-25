import axios from 'axios'

export async function getSysTemplates() {
  return axios.get('/templates/tpl-list.json')
}

export async function getSysTemplate(id: number) {
  return axios.get(`/templates/tpl-${id}.json`)
}
