import axios from 'axios'
// import { queryString, getCookie } from 'utils'
import { queryString } from 'utils'
import { Toast } from 'vant'
import Vue from 'vue'

// Create axios instance
const Axios = axios.create({
  baseURL: '/api',
  timeout: 20000,
  responseType: 'json'
})

/**
 * Global request interceptor
 * Authorization header should be injected when request if your project includes JWT auth rules
 */
// const tokenExcludes = /auth\/?.*/
Axios.interceptors.request.use(
  config => {
    // let url = config.url || ''

    // if (!tokenExcludes.test(url)) {
    //   let token = getCookie(cookieTokenName)
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    // Request cancellation
    if (typeof config.cancellation === 'function') {
      config.cancelToken = new axios.CancelToken(function (c) {
        config.cancellation(c)
      })
    }
    return config
  }
)

/**
 * Global response interceptor
 */
Axios.interceptors.response.use(
  response => {
    // Data will be intercepted by default
    let results = response.data || {}
    return results
  },
  error => {
    // Error handler
    let { err = 'Error!' } = error.response.data
    let errorMessage = ''

    errorMessage = error.response.status === 401 ? 'Login fail' : err
    Toast({
      message: errorMessage,
      position: 'bottom',
      duration: 2000
    })
    return Promise.reject(error.response)
  }
)

/**
 * Unify rest-api rules
 */
const dataInConfigMethods = ['delete', 'head', 'options']
const _fetch = (method, url, data = {}, options = {}) => {
  method = method.toLowerCase()

  let fetchUrl = method === 'get' ? `${url}?${queryString.stringify(data)}` : url

  if (method === 'get') {
    return Axios.get(fetchUrl, options)
  } else if (dataInConfigMethods.includes(method)) {
    return Axios[method](fetchUrl, { data, ...options })
  }
  return Axios[method](fetchUrl, data, options)
}

Vue.prototype.$axios = Axios

export default _fetch
