import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

// 引入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'

// 引入通用基础样式
import '@/assets/index.less'
// 引入axios
import axios from 'axios'
// 将axios挂到Vue实例上
Vue.prototype.axios = axios
// 配置全局默认值
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器,设置headers
axios.interceptors.request.use(config => {
  config.headers = {
    Authorization: localStorage.getItem('token')
  }
  return config
})
// 添加响应拦截器,处理数据
axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
