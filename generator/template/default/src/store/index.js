import Vue from 'vue'
import Vuex from 'vuex'
import commonModules from './common'

const StoreFactory = pageModules => {
  Vue.use(Vuex)
  
  return new Vuex.Store({
    modules: {
      ...commonModules,
      ...pageModules
    }
  })
}

export default StoreFactory

