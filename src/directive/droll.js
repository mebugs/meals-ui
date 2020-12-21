// droll.js
import Vue from 'vue'
// v-droll: 弹窗拖拽
Vue.directive('droll', {
  bind(el, binding, vnode, oldVnode) { // 入参：绑定元素、对象、虚拟节点、上一个虚拟节点
    // 获取拖拽内容头部
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    // 获取拖拽内容整体
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'grab'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null)
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
    // 鼠标按下事件
    dialogHeaderEl.onmousedown = (e) => {
      dialogHeaderEl.style.cursor = 'grabbing'
      // 禁用原生事件
      e.preventDefault()
      // 计算活动范围区间
      const leftBg = (dragDom.clientWidth - dragDom.offsetParent.clientWidth) / 2
      const leftEd = (dragDom.offsetParent.clientWidth - dragDom.clientWidth) / 2
      const topBg = -(dragDom.offsetParent.clientHeight * 0.15)
      const topEd = (dragDom.offsetParent.clientHeight - dragDom.clientHeight) - (dragDom.offsetParent.clientHeight * 0.15)
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      // 获取到的值带px 正则匹配替换
      let styL, styT
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
      // 鼠标拖拽事件
      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
        const l = e.clientX - disX
        const t = e.clientY - disY
        let finallyL = l + styL
        let finallyT = t + styT
        // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
        // dragDom.offsetParent表示弹窗阴影部分
        if (finallyL < leftBg) {
          finallyL = leftBg
        } else if (finallyL > leftEd) {
          finallyL = leftEd
        }
        if (finallyT < topBg) {
          finallyT = topBg
        } else if (finallyT > topEd) {
          finallyT = topEd
        }
        // 移动当前元素
        dragDom.style.left = `${finallyL}px`
        dragDom.style.top = `${finallyT}px`
        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }
      document.onmouseup = function(e) {
        dialogHeaderEl.style.cursor = 'grab'
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
