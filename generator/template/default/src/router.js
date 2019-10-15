import Vue from 'vue'
import VueRouter from 'vue-router'
// import { getCookie } from 'utils'

const RouterFactory = (routes, store) => {
  Vue.use(VueRouter)
  
  const router = new VueRouter({
    mode: 'hash',
    routes,
    caseSensitive: true
  })

  // Router global before-hook
  router.beforeEach((to, from, next) => {
    /**
     * If you coincidently use JWT auth rules to maintain the project, this following router-hook logic is recommended
     */
    
    // let cookieToken = getCookie(cookieTokenName)
    // let path = to.path

    // if (path !== '/login') {
    //   cookieToken ? next() : next({ path: '/login' })
    // } else {
    //   next()
    // }
    
    next()
  })

  /**
   * Define app global "forward" and "backward", mutate the direction after routes change
   * Store in state and sessionStorage
   */
  const history = window.sessionStorage
  history.clear()
  let historyCount = history.getItem('count') || 0 * 1
  history.setItem('/', '0')

  // Router global after-hook
  router.afterEach((to, from) => {
    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)

    if (toIndex) {
      if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
        store.commit('UPDATE_DIRECTION', 'forward')
      } else {
        store.commit('UPDATE_DIRECTION', 'backward')
      }
    } else {
      historyCount = Number(historyCount) + 1
      history.setItem('count', `${historyCount}`)
      to.path !== '/' && history.setItem(to.path, `${historyCount}`)
      store.commit('UPDATE_DIRECTION', 'forward')
    }
  })

  return router
}

export default RouterFactory
