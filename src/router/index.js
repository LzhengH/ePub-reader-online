import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/book',
    component: () => import('../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader.vue'),
        name: '阅读页面'
      }
    ]
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    name: '电子书选择'
  }
]

const router = new VueRouter({
  routes,
  // meta: {
  //   keepAlive: true
  // }
})

export default router
