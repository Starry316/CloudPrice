import request from '@/utils/request'

const baseurl = "/api/user"

export function getRole() {
  return request({
    url: baseurl+'/role',
    method: 'get'
  })
}

export function modifyProfile(data) {
  return request({
    url: baseurl+'/modifyProfile',
    method: 'post',
    data: data
  })
}

export function modifyPassword(data) {
  return request({
    url: baseurl+'/modifyPassword',
    method: 'post',
    data: data
  })
}
