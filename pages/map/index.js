let mapsdk = require('../../utils/qqmap-wx-jssdk.js')
let qqmap = new mapsdk({
  key: '7CHBZ-QB633-WBR3Y-3EYLY-ZWWJJ-UWBHT' // 申请地址：https://lbs.qq.com/console/key.html
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    address: '根据经纬度实时解析当前位置。',
    search_res: ''
  },

  onLoad: function(options) {
    let _this = this
    _this.getLocation()
    _this.search('学校')
  },

  /**
   * 根据关键字搜索周边地点
   */
  search: function(keyword) {
    let _this = this
    qqmap.search({
      keyword: keyword,
      success: function(res) {
        console.log('有关', keyword, '的搜索结果', res);
        _this.setData({
          search_res: res
        })
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {}
    })
  },

  /**
   * 根据坐标解析地址
   */
  parseCoord: function() {
    let _this = this
    let longitude = _this.data.longitude
    let latitude = _this.data.latitude
    qqmap.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log('坐标转地址', res)
        _this.setData({
          address: res.result.address
        })
      }
    })
  },

  /**
   * 根据地址解析坐标
   */
  geocoder: function() {
    let _this = this
    qqmap.geocoder({
      address: _this.data.address,
      success: function(res) {
        console.log('地址转坐标', res)
        _this.setData({
          longitude: res.result.location.lng,
          latitude: res.result.location.lat
        })
      }
    })
  },

  /**
   * 复制内容
   */
  copy: function(e) {
    let _this = this
    let text = _this.data.latitude + "," + _this.data.longitude + '\n' + _this.data.address
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

  /**
   * 地图切换到当前位置（获取当前经纬度，赋值给地图组件）
   */
  getLocation: function() {
    let _this = this
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function(res) {
        console.log('坐标信息', res)
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
 * 地址搜索
 */
moveChoose:function(e){
  let _this = this
  wx.chooseLocation({
    success: function(res) {
      console.log('地址搜索', res)
      _this.setData({
        longitude:res.longitude,
        latitude:res.latitude,
        address:res.address
      })
    },
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