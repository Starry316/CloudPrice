import request from '@/utils/request'

export function list() {
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
