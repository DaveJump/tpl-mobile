const Home = () => import(/* webpackChunkName: "index-home" */ './views/home/index.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      keepAlive: true
    },
    component: Home
  }
]

export default routes