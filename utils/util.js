var Promise = require('es6-promise.min.js')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function sleep(ms) {
  return new Promise((resolve) => {
    console.log('执行 sleep')
    setTimeout(resolve, ms)
  })
}

let dtime = '_deadtime';

function putStorage(key, value, time) {
  wx.setStorageSync(key, value)
  var seconds = parseInt(time);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(key + dtime, timestamp + "")
  } else {
    wx.removeStorageSync(key + dtime)
  }
}

function getStorage(key, def) {
  var deadtime = parseInt(wx.getStorageSync(key + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) {
        return def;
      } else {
        return;
      }
    }
  }
  var res = wx.getStorageSync(key);
  if (res) {
    return res;
  } else {
    return def;
  }
}

function removeStorage(key) {
  wx.removeStorageSync(key);
  wx.removeStorageSync(key + dtime);
}

function clearStorage() {
  wx.clearStorageSync();
}

/**
 * obj = {} 写在 最外层的理由：
 * 由于 .then 和 .catch 需要的参数是一个函数
 * 如果将 obj 写在 return (obj) 位置
 * 如果遇到要传参的情况，就会导致传参时，函数被调用
 * 最终导致后续 .then 的参数是 Promise ，从而串行执行机制失效。
 */
function wxPromise(callback, obj = {}) {
  return () => {
    return new Promise((resolve, reject) => {
      obj.success = res => {
        if (res.statusCode) {
          if (res.statusCode != 200) {
            console.warn('request object', obj)
            console.error('response', res)
            reject(res)
            return
          }
        }
        console.log('success', res)
        resolve(res)
      }
      obj.fail = res => {
        console.warn('request object', obj)
        console.error('fail', res)
        reject(res)
      }
      callback(obj)
    })
  }
}

/**
 * 使用普通函数的 Promise ，通过这个方法，可以让用户传入普通函数进行 Promise 流程，而不影响普通函数内部逻辑和结构。
 * 普通函数中，只需要加两个参数并在任意希望返回的位置调用它们就可以了，它们分别是 resolve 和 reject 默认值为空匿名函数。
 * Promise 函数的 resolve 和 reject 是可以任意命名的，它根据两者的位置决定是否通过，第一个表示通过，第二个表示拒绝。
 * 所以，如果 args 传过来的数组参数数量不等于 callback 实际需要的参数，会导致执行的结果变得难以确认。
 */
function miniPromise(callback, args = []) {
  return () => {
    return new Promise((resolve, reject) => {
      args.push(resolve, reject)
      callback(...args)
    })
  }
}

module.exports = {
  formatTime: formatTime,
  sleep: sleep,
  setStorage: putStorage,
  getStorage: getStorage,
  removeStorage: removeStorage,
  clearStorage: clearStorage,
  wxPromise: wxPromise,
  miniPromise: miniPromise
}