import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '工作中心',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作中心', icon: 'el-icon-help' }
    }]
  }
]
// 动态路由
export const asyncRoutes = [
  {
    path: '/role',
    component: Layout,
    redirect: '/role/def',
    alwaysShow: true, // will always show the root menu
    name: '测试页',
    meta: { title: '测试页', icon: 'el-icon-toilet-paper' },
    children: [
      {
        path: 'def',
        component: () => import('@/views/role/def'),
        name: '全员可见',
        meta: { title: '全员可见' }
      },
      {
        path: 'admin',
        component: () => import('@/views/role/admin'),
        name: '仅超管可见',
        meta: { title: '仅超管可见', roles: ['admin'] }
      },
      {
        path: 'adminadev',
        component: () => import('@/views/role/adminadev'),
        name: '超管/研发可见',
        meta: { title: '超管/研发可见', roles: ['admin', 'dev'] }
      },
      {
        path: 'more',
        component: () => import('@/views/role/more'),
        name: '多级路由',
        meta: { title: '多级路由', breadcrumb: false },
        children: [
          {
            path: 'child',
            component: () => import('@/views/role/more/child'),
            name: '子级路由界面',
            meta: { title: '子级路由界面' }
          },
          {
            path: 'more',
            component: () => import('@/views/role/more/index'),
            name: '更多子级路由',
            meta: { title: '更多子级路由', breadcrumb: false },
            children: [
              {
                path: 'child',
                component: () => import('@/views/role/more/child/index'),
                name: '更子级路由界面1',
                meta: { title: '更子级路由界面1' }
              },
              {
                path: 'child2',
                component: () => import('@/views/role/more/child/index'),
                name: '更子级路由界面2',
                meta: { title: '更子级路由界面2' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/list',
    alwaysShow: true, // will always show the root menu
    name: '基础管理',
    meta: {
      title: '基础管理',
      icon: 'el-icon-setting',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/sys/list'),
        name: '用户管理',
        meta: { title: '用户管理' }
      },
      {
        path: 'auth',
        component: () => import('@/views/sys/auth'),
        name: '查看权限集',
        meta: { title: '查看权限集' }
      }
    ]
  },
  {
    path: '/code',
    component: Layout,
    redirect: '/code/list',
    alwaysShow: true, // will always show the root menu
    name: '代码生成',
    meta: {
      title: '代码生成',
      icon: 'el-icon-attract',
      roles: ['dev']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/codeMaker/index'),
        name: '代码生成器',
        meta: { title: '代码生成器' }
      }
    ]
  },
  {
    path: '/mine',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    meta: { breadcrumb: false },
    children: [
      {
        path: 'center',
        component: () => import('@/views/sys/center'),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
