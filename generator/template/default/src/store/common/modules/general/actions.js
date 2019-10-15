import * as types from './type-defs'

export default {
  updateDirection ({ commit }, val) {
    commit(types.UPDATE_DIRECTION, val)
  }
}
