import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

// 引入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'

// 引入通用基础样式
import '@/assets/index.less'

Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
