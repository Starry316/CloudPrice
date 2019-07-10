import request from '@/utils/request'
import pyService from '@/utils/pyservice'
const baseurl = "/api/crawler"
const pyhost = "http://192.168.43.216:5000"
export function crawlerHistory() {
  return request({
    url: baseurl+'/history',
    method: 'get'
  })
}


export function changeConfig(data) {
  return pyService({
    url: pyhost + baseurl+'/changeConfig',
    method: 'post',
    data:data
  })
}


export function changeStatus(data) {
  return pyService({
    url: pyhost + baseurl+'/changeStatus',
    method: 'post',
    data:data
  })
}

export function crawlerStatus() {
  return pyService({
    url: pyhost + baseurl+'/status',
    method: 'get'
  })
}
export function pytest() {
  return pyService({
    url: pyhost+'/py/api/crawler',
    method: 'post',
    data:{text:"a"}
  })
}

