// pages/x/x.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLocation()
  },
  copy: function(e) {
    let _this = this
    let text = _this.data.latitude + "," + _this.data.longitude
    wx.setClipboardData({
      data: text,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getLocation: function() {
    let _this = this
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function(res) {
        console.log(res)
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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