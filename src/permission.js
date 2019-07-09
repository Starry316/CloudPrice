import router from './router'
import store from './store'
import { Message } from 'element-ui'
import {adminRoutes} from "./router";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserRole = store.getters.role
      const hasGetUserRoleList = store.getters.roleList
      // if (hasGetUserRole) {
      if (hasGetUserRoleList) {
        next()
      } else {
        try {

          // await store.dispatch('user/getRole')

          // route的权限控制

          let role = "normal"
          // store.commit('user/SET_ROLE', role)
          for (let i = 0; i <roleList.length; i++) {
            if (roleList[i].name =="ROLE_ADMIN") role = "admin"
          }

          store.commit('user/SET_ROLE', role)
          // vuex中的路由控制侧边栏的渲染
          const accessRoutes = await store.dispatch('permission/generateRoutes', role)
          await router.addRoutes(accessRoutes)
          next({ ...to, replace: true })

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
