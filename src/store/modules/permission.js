import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param authKeys 权限集
 * @param route
 */
function hasPermission(authKeys, route) {
  if (route.meta && route.meta.auth) {
    return authKeys.includes(route.meta.auth)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param authKeys
 */
export function filterAsyncRoutes(routes, authKeys) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(authKeys, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authKeys)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, authKeys) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, authKeys)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
