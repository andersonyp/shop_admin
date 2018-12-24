/*
 * @Author: TianYunPeng
 * @Date: 2018-12-20 21:16:39
 * @Last Modified by: TianYunPeng
 * @Last Modified time: 2018-12-24 20:13:32
 */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'
import Rights from '@/components/Rights'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      // 在路由中使用children属性来嵌套子路由
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        }
      ]
    }
  ]
})

// 给router对象注册一个导航守卫, 将来所有的导航(路由发生了跳转),都要经过router.beforeEach
// to: 要去哪儿
// from: 从哪儿来
// next: 是否放行, next() 表示直接放行 next('/xx') 表示跳转到指定路由

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
