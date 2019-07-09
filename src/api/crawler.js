import request from '@/utils/request'
const baseurl = "/api/crawler"

export function crawlerHistory() {
  return request({
    url: baseurl+'/history',
    method: 'get'
  })
}


export function changeConfig(data) {
  return request({
    url: baseurl+'/changeConfig',
    method: 'post',
    data:data
  })
}


export function changeStatus(data) {
  return request({
    url: baseurl+'/changeStatus',
    method: 'post',
    data:data
  })
}

export function crawlerStatus() {
  return request({
    url: baseurl+'/status',
    method: 'get'
  })
}
