const Storage = window.localStorage

export const queryString = {
  stringify (obj) {
    return Object.keys(obj).reduce((concated, next) => (
      `${concated}${next}=${obj[next]}&`
    ), '').slice(0, -1)
  },
  parse (str) {
    let obj = {}
    if (str) {
      str.split('&').forEach(item => {
        let key = item.split('=')[0]
        let val = item.split('=')[1]
        obj[key] = val
      })
    }
    return obj
  }
}

export const setCookie = function (key, value, expSecs = 0) {
  let oDate = new Date()
  oDate.setTime(oDate.getTime() + Number(expSecs) * 1000)
  document.cookie = `${key}=${escape(value)}${expSecs ? `;expires=${oDate.toUTCString()}` : ''}`
}

export const removeCookie = function (key) {
  setCookie(key, '', -1)
}

export const getCookie = function (key) {
  let cookieArr = document.cookie.split('; ')
  for (let i = 0; i < cookieArr.length; i++) {
    let arr = cookieArr[i].split('=')
    if (arr[0] === key) {
      return unescape(arr[1])
    }
  }
}

export const setStorage = function (key, value) {
  Storage.setItem(key, value)
}

export const getStorage = function (key) {
  return Storage.getItem(key)
}

export default {
  queryString,
  setCookie,
  removeCookie,
  getCookie,
  setStorage,
  getStorage
}
