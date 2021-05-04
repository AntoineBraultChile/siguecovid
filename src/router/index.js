import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// import ChartChile from '../components/ChartChile.vue'

// import ChartRegions from '../components/ChartRegions.vue'
// import ChartUciAge from '../components/ChartUciAge.vue'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    name: 'ChartChile',
    // component: ChartChile,
    component: () => import(/* webpackChunkName: "about" */ '../views/ChartChile.vue')
  },
  {
    path: '/regions',
    name: 'ChartRegions',
    component: () => import(/* webpackChunkName: "about" */ '../views/ChartRegions.vue')
  },
  {
    path: '/edad',
    name: 'ChartAge',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ChartAge.vue')
  },
  {
    path: '/vacuna',
    name: 'ChartVacuna',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ChartVacuna.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 };
  }
})

export default router
