import _fetch from 'api/handlers'

const userAPI = {
  login (data, options) {
    return _fetch('PUT', '/auth', data, options)
  },
  register (data, options) {
    return _fetch('POST', '/auth', data, options)
  }
}

export default userAPI
