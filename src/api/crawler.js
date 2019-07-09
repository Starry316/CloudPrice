import request from '@/utils/request'
import pyService from '@/utils/pyservice'
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
export function pytest() {
  return pyService({
    url: 'http://127.0.0.1:5000/api/v1/rewrite',
    method: 'get'
  })
}

