// pages/address/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '识别用户微信中设置的地址和联系方式。',
    phoneNumber: '',
    address: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 获取微信绑定的手机号加密数据
   * 用户不同意授权errMsg返回‘getPhoneNumber:fail user deny’
   * 用户同意授权errMsg返回‘getPhoneNumber:ok’
   * 用户同意授权，我们可以根据login时获取到的code来通过后台以及微信处理拿到session_key，最后通过app_id，session_key,iv,encryptedData
   * 开放数据校验与解密
   * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html
   */
  getPhoneNumber: function(e) {
    let _this = this
    console.log('手机号加密数据获取结果', e.detail)
    console.log('iv:', e.detail.iv)
    console.log('errMsg:', e.detail.errMsg)
    console.log('encryptedData:', e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {}
      })
    } else {
      _this.setData({
        message: e.detail.encryptedData
      })
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function(res) {}
      })
    }
  },

  //用户选择收货地址
  chooseAddress: function () {
    let _this = this
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
        _this.setData({
          message: res.userName + '\n' + res.telNumber + '\n' + res.provinceName + '-' + res.cityName + '-' + res.countyName + '-' + res.detailInfo
        })
      },
      fail: function(err) {
        console.log(err);
        console.info("收货地址授权失败");
        wx.showToast({
          title: '授权失败',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },

  copy: function () {
    let _this = this
    wx.setClipboardData({
      data: _this.data.message,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
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