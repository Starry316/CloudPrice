import request from '@/utils/request'

export function list(page) {
  return request({
    url: '/cloud/list',
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
    url: 'cloud/serverInfo',
    method: 'get'

  })
}
