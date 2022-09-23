import axios from 'axios'

export async function getStaticData(comId: string, comPath: string) {
  return axios.get(`/elementStaticData/${comPath}.json?comId=${comId}`)
}
