import store from '@/store'
// authorize.js
import Vue from 'vue'
// v-authorize: 授权控制
Vue.directive('authorize', {
  // 该指令需要在元素即将执行插入时执行
  inserted(el, binding, vnode, oldVnode) { // 入参：绑定元素、对象、虚拟节点、上一个虚拟节点
    // 提取绑定入参AUTHKEY
    const { value } = binding
    // 提取用户的权限集
    const authKeys = store.getters && store.getters.authKeys
    if (value && value.length > 0) {
      // 权限集中不包含该权限
      if (!authKeys.includes(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`需要配置权限!如 v-authorize="'CR-USER'"`)
    }
  }
})
