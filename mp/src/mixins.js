import getSafeArea from './utils/safe-area'
let MyPlugin = {}
MyPlugin.install = function(Vue) {
  // 添加全局方法或属性
  Vue.prototype.$isPage = function isPage() {
    return this.$mp && this.$mp.mpType === 'page'
  }
  // 注入组件
  Vue.mixin({
    data() {
      return {
        isIPhoneX: this.isIPhoneX,
      }
    },
    mounted() {
      if (this.$isPage()) {
        getSafeArea().then(({ isIPhoneX, statusBarHeight }) => {
          this.isIPhoneX = isIPhoneX
        })
      }
    },
  })
}
export default MyPlugin
