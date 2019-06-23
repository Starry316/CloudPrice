import Vue from 'vue'
import Router from 'vue-router'
import Echarts from 'echarts'

Vue.use(Router) //导入Vue和VueRouter
Vue.prototype.$echarts = Echarts

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  // {
  //   path: '/login',//path的作用？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
  //   component: () => import('@/views/login/register'),
  //   hidden: false
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: false
  },





//定义路由，每个路由映射一个组件
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'mainboard',
      name: 'MainBoard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    // redirect: '/user',
    children: [{
      path: 'index',
      name: 'User',
      component: () => import('@/views/user/index'),
      meta: { title: '个人信息', icon: 'user' }
    }]
  },
  // {
  //   path: '/graph',   //从path重定向到redirect
  //   component: Layout,
  //   redirect: '/graph/index',
  //   children: [{
  //     path: 'index',
  //     name: 'Graph',
  //     component: () => import('@/views/graph/index'),
  //     meta: { title: '会员管理', icon: 'user' }
  //   }]
  // },

  {
    path: '/price',
    component: Layout,
    // redirect: '/user',
    children: [{
      path: 'index',
      name: 'Price',
      component: () => import('@/views/graph/index'),
      meta: { title: '价格查询', icon: 'money' }
    }]
  },

]

export const adminRoutes = [


  {
    path: '/crawler',
    component: Layout,
    // redirect: '/user',
    children: [{
      path: 'index',
      name: 'Crawler',
      component: () => import('@/views/crawler/index'),
      meta: { title: '爬虫配置', icon: 'bug' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: false
  },
  { path: '*', redirect: '/404', hidden: true }
]


export const errorRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: false
  },
  { path: '*', redirect: '/404', hidden: true }
]

//创建路由实例
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');

    if (token === 'null' || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});

export default router

