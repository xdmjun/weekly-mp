import Vue from 'vue'
import App from './App'
import './iconfonts/css/iconfont.css'
import MyPlugin from './mixins'
Vue.use(MyPlugin)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

wx.cloud.init({
  traceUser: true
})
