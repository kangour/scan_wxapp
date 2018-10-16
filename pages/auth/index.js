// pages/auth/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOpenSetting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  auth_album: function() {
    let _this = this
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: function(res) {
        console.log('存在授权')
      },
      fail: function(res) {
        console.log("没有授权")
        _this.setData({
          showOpenSetting: true
        })
      }
    })
  },

  auth_location: function() {
    let _this = this

    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function(res) {
        console.log('存在授权')
      },
      fail: function(res) {
        console.log("没有授权")
        _this.setData({
          showOpenSetting: true
        })
      },
      complete: function(res) {},
    })
  },

  openSetting: function() {
    let _this = this
    wx.openSetting({
      success: function(res) {
        _this.setData({
          showOpenSetting: false
        })
        console.log('成功开启任务页面')
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  cancelOpenSetting: function() {
    this.setData({
      showOpenSetting: false
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