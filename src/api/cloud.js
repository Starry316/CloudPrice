import request from '@/utils/request'
const baseurl = '/api/cloud'
export function list(page) {
  return request({
    url: baseurl+'/list/'+page,
    method: 'get',
  })
}


export function history(data) {
  return request({
    url: '/cloud/history',
    method: 'get',
    params: { data }
  })
}
export function serverInfo() {
  return request({
    url: baseurl+'/serverInfo',
    method: 'get'

  })
}
