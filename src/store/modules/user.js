import { login, register, logout } from '@/api/account'
import {  getRole } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { hex_sha1 } from '@/utils/sha1.js'
const state = {
  token: getToken(),
  name: '',
  avatar: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3434964180,3432166125&fm=85&app=63&f=JPEG?w=121&h=75&s=2CC0985EC2A2C7FD0EBDFABE0300501D',
  role:''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password,code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password,code:code })
        .then(response => {
          const { data } = response
          const { username, avatar, } = data
          setToken(username)
          commit('SET_TOKEN', username)
          commit('SET_NAME', username)
          // commit('SET_AVATAR', avatar)
          resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  register({ commit }, userInfo) {
    const { name, password, code,email  } = userInfo
    return new Promise((resolve, reject) => {
      register({ username: name.trim(), password: password, code:code, email:email})
        .then(response => {
          if (response.status === 200)
            resolve()
          else reject()
          //   const { data } = response
        //   const { username, avatar, } = data
        // setToken(username)
        // commit('SET_TOKEN', username)
        // commit('SET_NAME', username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getRole({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRole().then(response =>{
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { role } = data
        commit('SET_ROLE', role)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

