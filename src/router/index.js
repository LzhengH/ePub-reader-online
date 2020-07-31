import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/ebook',
    component: () => import('../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
  }
]

const router = new VueRouter({
  routes,
  // meta: {
  //   keepAlive: true
  // }
})

export default router
