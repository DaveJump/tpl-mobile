/**
 * Create App instance
 */
import store from '@/store/main'
import routes from './routes'
import App from '@/app'
import root from './root'

const appInstance = new App({
  root,
  routes,
  store
})

appInstance.init()