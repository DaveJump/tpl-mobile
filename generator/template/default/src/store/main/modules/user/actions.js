import * as types from './type-defs'

export default {
  changeLoginStat ({ commit }, val) {
    commit(types.LOGIN_STAT, val)
  }
}
