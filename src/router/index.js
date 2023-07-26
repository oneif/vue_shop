import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Categories from '../components/goods/Categories'
import Params from '../components/goods/Params'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('../components/Login')
    },
    {
      path: '/home',
      component: () => import('../components/Home'),
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: () => import('../components/Welcome')
        },
        {
          path: '/users',
          component: () => import('../components/user/Users')
        },
        {
          path: '/rights',
          component: () => import('../components/power/Rights')
        },
        {
          path: '/roles',
          component: () => import('../components/power/Roles')
        },
        {
          path: '/categories',
          component: () => import('../components/goods/Categories')
        },
        {
          path: '/params',
          component: () => import('../components/goods/Params')
        
        },
        {
          path: '/goods',
          component: () => import('../components/goods/Lists') 
        },
        {
          path: '/goods/add',
          component: () => import('../components/goods/AddGoods')
        },
        {
          path: '/orders',
          component: () => import('../components/order/Order')
        },
        {
          path: '/reports',
          component: () => import('../components/report/Report')
        }
      ]
    },
  ]
})


// 挂载前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
