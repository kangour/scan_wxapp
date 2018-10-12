// pages/promise/index.js
const util = require('../../utils/util.js')
const wxPromise = util.wxPromise
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 请去除注释后，逐个尝试。

    // 测试请求串行执行
    /**
     * 使用教程：
     * wxPromise 用于调用微信提供的API，即以 wx. 开头的代码。
     * util.wxPromise 第一个参数是API名字，如果有参数，用花括号传入键值对，返回的是一个函数。
     * 第二个括号表示调用返回的函数，最终得到一个 Promise 对象。
     * 形如：util.wxPromise(wx.login)()
     * 因为 Promise 对象后面才能接 then 和catch。
     * 由于 then 和catch 要求传入的是函数，所以，在之后的串行机制中，不需要使用第二个括号。
     * 函数执行后，可以在 then 和 catch 中获取。
     */
    // util.wxPromise(wx.login)() // 手动添加括号调用 以返回 Promise 对象
    //   .then(util.wxPromise(wx.getLocation)) // 不需要返回值
    //   .then(util.wxPromise(wx.getStorage, {  // 传参
    //     key: 'logs'
    //   }))
    //   .then(res => {  // 需要返回值
    //     console.log('返回值', res)
    //     return util.wxPromise(wx.getLocation)() // 手动添加括号调用并返回给上层
    //   }) // 需要返回值 使用 return
    //   .catch(res => {
    //     console.log('异常处理', res)
    //   })
    /**
     * wx.request 和上面的用法相同，不同的是，wxPromise 中，会对请求状态值 statusCode 进行判断，如果不是 200，会抛出异常。
     */
    //所用的聚合API申请得治：https://www.juhe.cn
    // util.wxPromise(wx.request, {
    //     url: 'http://apis.juhe.cn/idcard/index', //聚合数据 api
    //     data: {
    //       key: 'e07eabb619a4468c390a5380c0fbace7',
    //       cardno: '330326198903081211'
    //     }
    //   })()
    //   .then(res => {
    //     //console.log('请求完成', res)
    //   })
    //   .then(util.wxPromise(wx.request, {
    //     url: 'http://apis.juhe.cn/idcard/index',
    //     data: {
    //       key: 'e07eabb619a4468c390a5380c0fbace7_xxxxxx',
    //       cardno: '330326198903081211'
    //     }
    //   }))
    //   .then(util.wxPromise(wx.request, {
    //     url: 'http://apis.juhe.cn/idcard/index', //聚合数据 api
    //     data: {
    //       key: 'e07eabb619a4468c390a5380c0fbace7',
    //       cardno: '330326198903081211_xxxxxx'
    //     }
    //   }))
    //   .then(res => {
    //     //console.log('请求完成', res)
    //   })
    //   .catch(res => {
    //     console.warn('异常处理', res)
    //   })
    // 测试 Promise 调用
    /**
     * 使用教程
     * 用法和 wxPromise 类似，不同的是参数传递方式，微信自带的API使用的是键值对参数，而自己定义的函数则不是规定的键值对，而是更为灵活的普通参数，考虑到动态传参的通用性，miniPromise 中，使用数组传参，miniPromise 追加了 resolve 和 reject方法后，会通过三点运算符将数组参数转换参数列表形式。
     */
    util.miniPromise(this.test1, ['kangour', 18])()
      .then(util.miniPromise(this.test2, ['kangour', 17]))
      .then(util.miniPromise(this.test1, ['jouns', 17]))
      .then(res => {
        console.log('success', res)
      })
      .catch(res => {
        console.warn('fail', res)
      })
    // 测试直接调用
    /**
     * 使用教程：
     * 考虑到，部分函数可能需要串行执行后的二次调用，这里将自定义函数的 resolve 和reject 参数都定义为空的匿名函数，这样一来，在非 Promise 串行机制中，它们的执行不会对结果造成任何影响，而且整个函数保留了原始的逻辑结构。
     * 总的来说，实现了自定义函数原始能力没有遭到破坏的前提下为它提供了新的能力——串行执行。
     * 我们仅仅在自定义函数中做了两件事：
     * 1、添加两个参数，默认值为空的匿名函数。（不影响正常逻辑和结构）
     * 2、调用它们——在正常逻辑满足函数需求后，调用 resolve，不满足时，调用 reject。（不影响正常逻辑和结构）
     */
    // this.test1('kangour', 18)
    // this.test1('jouns', 17)
  },
  /**
   * 普通函数，只需要加两个参数并在任意希望返回的位置调用它们，它们分别是 resolve 和 reject 默认值为空匿名函数。
   * 由于是空函数，它不会对函数的正常逻辑和结构造成影响
   * 但，一旦被 miniPromise 函数处理并使用，它将拥有串行执行的能力。
   *
   */
  test1(nama, age, resolve = () => { }, reject = () => { }) {
    // console.log('resolve', resolve)
    // console.log('nama = ', nama)
    // console.log('age = ', age)
    if (age >= 18) {
      console.log('执行通过')
      resolve('执行通过 ' + nama)
    } else {
      console.error('执行异常')
      reject('抛出异常 ' + nama)
    }
  },

  test2(nama, age, resolve = () => { }, reject = () => { }) {
    // console.log('resolve', resolve)
    // console.log('nama = ', nama)
    // console.log('age = ', age)
    if (age >= 18) {
      console.log('执行通过')
      resolve('执行通过 ' + nama)
    } else {
      console.error('执行异常')
      reject('抛出异常 ' + nama)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})