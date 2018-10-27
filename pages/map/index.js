let mapsdk = require('../../utils/qqmap-wx-jssdk.js')
let qqmap = new mapsdk({
  key: '7CHBZ-QB633-WBR3Y-3EYLY-ZWWJJ-UWBHT' // 申请地址：https://lbs.qq.com/console/key.html
})

/**
 * 待完成
 * 
 * 三种类型的导航，控件点击
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    from_longitude: 0,
    from_latitude: 0,
    to_longitude: 0,
    to_latitude: 0,
    address: '滑动地图实时解析',
    search_res: '',
    markers: '',
    map_width: '100%',
    map_height: 300,
    show_compass: true
  },

  onLoad: function(options) {
    let _this = this
    _this.getLocation()
    _this.search('学校')
    _this.navigate()
  },

  navigate: function() {
    let _this = this
    //距离计算
    console.log('距离计算')
    qqmap.calculateDistance({
      to: [{
        latitude: _this.from_latitude,
        longitude: _this.from_longitude
      }, {
        latitude: _this.to_latitude,
        longitude: _this.to_longitude
      }],
      success: function(res) {
        console.log('距离计算结果', res)
      },

      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
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
        console.warn('失败了', res);
      },
      complete: function(res) {}
    })
  },

  /**
   * 坐标解析地址
   */
  getAddress: function() {
    let _this = this
    let to_longitude = this.data.to_longitude
    let to_latitude = this.data.to_latitude
    qqmap.reverseGeocoder({
      location: {
        latitude: to_latitude,
        longitude: to_longitude
      },
      success: function(res) {
        console.log('坐标转地址', res)
        _this.setData({
          address: res.result.address + '\n' + res.result.formatted_addresses.recommend
        })
      }
    })
  },

  /**
   * 地址解析坐标
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
    let text =
      '定位坐标：' +
      _this.data.latitude + "," +
      _this.data.longitude + '\n' +
      '调整坐标：' +
      _this.data.to_latitude + "," +
      _this.data.to_longitude + '\n' +
      '对应地址：' +
      _this.data.address
    wx.setClipboardData({
      data: text,
      success: function(res) {
        // wx.showToast({
        //   title: '复制成功',
        //   icon: 'none',
        // })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * mapCtx.moveToLocation() 将地图中心移动到当前定位点，需要配合map组件的show-location使用
   * 依托于已经渲染完成的地图在生命周期 onload、onready、onshow 等页面还没有渲染完成的位置使用，会导致移动到坐标为（0, 0）处，显示位置是大海中。
   */
  backLocation: function() {
    let _this = this
    _this.mapCtx = wx.createMapContext('mini_map')
    _this.mapCtx.moveToLocation()
  },
  /**
   * 地图切换到当前位置（获取当前经纬度，赋值给地图组件）
   */
  getLocation: function() {
    let _this = this
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        console.log('坐标信息', res)
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
        _this.setStartMarker(res.longitude, res.latitude)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  setStartMarker: function(longitude, latitude) {
    this.setData({
      markers: [{
        id: 'now_location',
        iconPath: "../../image/map/icon_location.png",
        longitude: longitude,
        latitude: latitude,
        width: 30,
        height: 30
      }]
    })
  },

  markertap: function(e) {
    console.log('marker点击', e)
    wx.showToast({
      title: '未完成的功能',
      icon: 'none',
      image: '../../image/common/star.png',
      mask: false,
      duration: 400,
    })
  },

  xxxtap: function(e) {
    console.log('cover image 点击', e)
    wx.showToast({
      title: '未完成的功能',
      icon: 'none',
      image: '../../image/common/star.png',
      mask: false,
      duration: 400,
    })
  },

  /**
   * 移动地图选点（实时解析）
   */
  regionchange: function(e) {
    let _this = this
    if (e.type == 'end') {
      console.log('地图变化', e)
      _this.mapCtx = wx.createMapContext('mini_map')
      _this.mapCtx.getCenterLocation({
        success: function(res) {
          console.log('中点位置信息', res)
          // 这里的坐标不能设置为当前点坐标，否则会陷入死循环（当前点被移动点替代触发新的改变）
          _this.setData({
            to_longitude: res.longitude.toFixed(6),
            to_latitude: res.latitude.toFixed(6),
          })
        }
      })
    }
  },

  /**
   * 地图选点
   */
  moveChoose: function(e) {
    let _this = this
    wx.chooseLocation({
      success: function(res) {
        console.log('地图选点', res)
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address
        })
      },
    })
  },

  start_point: function() {
    let _this = this
    _this.setData({
      from_longitude: _this.data.to_longitude,
      from_latitude: _this.data.to_latitude
    })
    _this.setStartMarker(_this.data.to_longitude, _this.data.to_latitude)
  },

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