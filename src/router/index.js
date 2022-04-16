import Vue from 'vue'
import Router from 'vue-router'
import userInfo from '@/components/userInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'userInfo',
      component: userInfo
    }
  ]
})
