import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import homepage from '@/components/homepage'
// import Bmap from '@/components/map/Bmap.vue'
// import AMap from '@/components/Amap/Amap'
import Homepage from '@/components/Homepage'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: '/dist/',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    }
  ]
})
