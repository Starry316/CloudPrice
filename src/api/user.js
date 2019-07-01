import request from '@/utils/request'

const baseurl = "/api/account"
export function login(data) {
  return request({
    url: baseurl+'/login',
    method: 'post',
    data: data
  })
}

export function register(data) {
  return request({
    url: baseurl+'/register',
    method: 'post',
    data: data
  })
}



export function getRole() {
  return request({
    url: baseurl+'/role',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: baseurl+'/logout',
    method: 'post'
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
