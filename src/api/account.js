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

export function logout() {
  return request({
    url: baseurl+'/logout',
    method: 'post'
  })
}
