import request from '@/utils/request'

export function list() {
  return request({
    url: '/cloud/list',
    method: 'get',
  })
}
