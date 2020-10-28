const app = getApp()

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
  data: {
    barcode: '扫码预览（点此复制）',
    scan_success_voice: '/static/tip.wav',
    bag_id: null,
    fail_upload_bag_id: [],
  },
  onLoad: function () {

    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.error(res.errCode, res.errMsg, src)
    })

    this.retry_upload()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  scan: function (e) {
    let _this = this
    wx.scanCode({
      success: (res) => {
        wx.showToast({
          title: '识别完成',
          icon: 'none',
          duration: 1500,
          mask: false,
        })
        console.log(res)

        let scan_type = res.scanType
        let result = res.result

        _this.setData({
          barcode: result
        })

        if (scan_type == 'CODE_128') {
          if (_this.check_bag_id(result)) {
            if (_this.data.bag_id == result) {
              console.log('重复识别')
              return false
            }
            _this.data.bag_id = result
            _this.play_voice(_this.data.scan_success_voice)
            _this.request_bag_returned(result)
          }
        }
      },

      fail: (res) => {
        console.warn(res)

        _this.setData({
          barcode: '未识别到内容'
        })
      }
    })
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
  copy: function () {
    let _this = this
    wx.setClipboardData({
      data: _this.data.barcode,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
      },
      fail: function (res) { },
      complete: function (res) { },
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

  request_bag_returned: function (bag_id) {
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

})