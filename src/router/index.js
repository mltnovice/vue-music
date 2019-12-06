import Vue from 'vue'
import VueRouter from 'vue-router'
import Rank from '../components/rank/rank'
import Recommend from '../components/recommend/recommend'
import Search from '../components/search/search'
import Singer from '../components/singer/singer'
import SingerDetail from '../components/singer-detail/singer-detail'
import Disc from '../components/disc/disc'
import RankDisc from '../components/rank-disc/rank-disc'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: RankDisc
      }
    ]
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Disc
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
