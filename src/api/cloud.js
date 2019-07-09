import request from '@/utils/request'
const baseurl = '/api/server'
export function list(page) {
  return request({
    url: baseurl+'/list/'+page.toString(),
    method: 'get',
  })
}

/**
 * 获取服务器列表总计数
 *
 */
export function serverCount() {
  return request({
    url: baseurl+'/count',
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

export function serverPrice(data) {
  return request({
    url: baseurl+'/price',
    method: 'post',
    // params:{data}
    data: data
  })
}
