//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    message: '二维码内容识别工具（点击复制）',
  },
  onLoad: function () {
    
  },

  scan: function(e) {
    let _this = this
    wx.scanCode({
      success:(res)=>{
        wx.showToast({
          title: '识别完成',
          icon: 'none',
          duration: 1500,
          mask: false,
        })
        console.log(res)
        _this.setData({
          message:res.result
        })
      }
    })
  },

  copy:function(){
    let _this = this
    wx.setClipboardData({
      data: _this.data.message,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})
