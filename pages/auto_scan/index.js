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
    barcode: '扫码预览（点此复制）',
    scan_success_voice: '/static/tip.wav',
    bag_id: null,
    fail_upload_bag_id: [],
    has_camera_authorize: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.error(res.errCode, res.errMsg, src)
    })

    this.retry_upload()
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
    this.setData({
      barcode: result
    })

    if (scan_type == 'barcode') {
      if (this.check_bag_id(result)) {
        if (this.data.bag_id == result) {
          console.log('重复识别')
          return false
        }
        this.data.bag_id = result
        this.play_voice(this.data.scan_success_voice)
        this.request_bag_returned(result)
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

    wx.setClipboardData({
      data: _this.data.barcode,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  async retry_upload() {
    let bag_id = null
    while (true) {
      console.log('失败列表', this.data.fail_upload_bag_id)
      if (this.data.fail_upload_bag_id.length > 0) {
        bag_id = this.data.fail_upload_bag_id.shift()
        this.request_bag_returned(bag_id)
      }
      await sleep(5000)()
    }
  },

  request_bag_returned: function(bag_id) {
    console.log('上传', bag_id)
    let _this = this
    // wx.showLoading({
    //   title: '请稍候',
    // })
    let api = 'bag_returned'
    let data = {
      bag_id: bag_id,
    }
    mini_request(api, data)()
      .then(res => {
        // wx.hideLoading()
        if (res.data.result != "SUCCESS") {
          console.warn(api, res.data)
          // showModal('服务通知', res.data.description)
          if (res.data.reason == "BAG_ID_INVALID") {

          } else if (res.data.reason == "LOGISTICS_NOT_FOUND") {

          } else if (res.data.reason == "RECORD_SAVE_FAIL") {

          }
          return next_promise()
        }
        console.log(api, res.data)
        // TODO
        // showModal('请求成功啦', JSON.stringify(res.data))
        // showToast('操作成功')
      })
      .catch(res => {
        // wx.hideLoading()
        console.error(api, res)
        _this.data.fail_upload_bag_id.push(bag_id)
        // showModal('服务通知', '上传失败，请检查网络连接和服务器状态。')
        //showModal('服务通知', '服务器异常，请稍后再试')
        // TODO
      })
      .finally(res => {
        // TODO
      })
  },



  checkCameraAuthorize: function(resolve = () => {}, reject = () => {}) {
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

  openSetting: function() {
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