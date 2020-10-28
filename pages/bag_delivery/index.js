// pages/scan_return_bag/index.js

const innerAudioContext = wx.createInnerAudioContext()

import regeneratorRuntime from '../../utils/regenerator-runtime'

import {
  mini_request,
  mini_promise,
  nano_promise,
  next_promise,
  raise_promise,
  showToast,
  showModal,
  jumpToPage,
  sleep,
  logger,
} from '../../utils/util.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    bag_barcode: '袋子条码',
    logistics_barcode: '面单条码',
    scan_success_voice: '/static/tip.wav',
    has_camera_authorize: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.error(res.errCode, res.errMsg, src)
    })

    // this.retry_upload()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let _this = this
    nano_promise(_this.checkCameraAuthorize)()
      .then(res => {
        console.log('执行成功', res)
      })
      .catch(res => {
        console.warn('执行失败', res)
      })
      .finally(res => {
        console.log('执行完成', res)
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // takePhoto() {
  //   const ctx = wx.createCameraContext()
  //   ctx.takePhoto({
  //     quality: 'high',
  //     success: (res) => {
  //       this.setData({
  //         src: res.tempImagePath
  //       })
  //     }
  //   })
  // },

  camera_error(e) {
    console.log('camera_error', e.detail)
  },
  camera_stop(e) {
    console.log('camera_stop', e.detail)
  },
  camera_initdone(e) {
    console.log('camera_initdone', e.detail)
  },

  camera_scancode(e) {
    console.log('camera_scancode', e.detail)
    let scan_type = e.detail.type
    let result = e.detail.result

    if (scan_type == 'barcode') {
      if (this.check_bag_id(result)) {
        if (this.data.bag_barcode == result) {
          console.log('重复识别')
          return false
        }
        this.play_voice(this.data.scan_success_voice)

        this.setData({
          bag_barcode: result
        })

      } else {
        if (this.data.logistics_barcode == result) {
          console.log('重复识别')
          return false
        }
        this.play_voice(this.data.scan_success_voice)

        this.setData({
          logistics_barcode: result
        })
      }
    }
  },

  check_bag_id(barcode) {
    if (!(barcode.length == 19 || barcode.length == 14)) return false
    if (barcode.indexOf('V') == -1) return false
    return true
  },

  play_voice(src) {
    innerAudioContext.src = src
    innerAudioContext.play()
  },

  copy() {
    let _this = this
    console.log('copy')
    // this.play_voice(this.data.scan_success_voice)
    let logistics_barcode = _this.data.logistics_barcode
    let bag_barcode = _this.data.bag_barcode
    let value = "dict(phone_number='', logistics_barcode='" + logistics_barcode + "', vloop_bag_id='" + bag_barcode + "', gift_name=''),"
    wx.setClipboardData({
      data: value,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
        // _this.setData({
        //   logistics_barcode: '',
        //   bag_barcode: '',
        // })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  checkCameraAuthorize: function (resolve = () => { }, reject = () => { }) {
    let _this = this
    mini_promise(wx.authorize, {
      scope: 'scope.camera'
    })()
      .then(res => {
        _this.setData({
          has_camera_authorize: true
        })
        resolve(res)
      })
      .catch(res => {
        _this.setData({
          has_camera_authorize: false
        })
        reject(res)
      })
  },

  openSetting: function () {
    let _this = this
    console.log('openSetting')
    mini_promise(wx.openSetting)()
      .then(nano_promise(_this.checkCameraAuthorize))
      .catch(res => {
        // showModal('提示', '请点击右上角【···】— 设置 — 打开定位')
        console.error(res)
      })
  },
})