//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    message: '图片缓存读取工具（点击复制）',
    image_path: '',
  },
  onLoad: function() {

  },

  read: function(e) {
    console.log('读取本地图片',e)
    let _this = this
    wx.getFileInfo({
      filePath: _this.data.message,
      digestAlgorithm: 'md5',
      success: function(res) {
        console.log('成功', res)
        _this.setData({
          message: res.digest
        })
      },
      fail: function(res) {
        console.log('失败', res)
      },
      complete: function(res) {},
    })
  },

  down: function(e) {
    console.log('远程图片缓存',e)
    let _this = this
    let task = wx.downloadFile({
      url: 'https://lg-6q2c525o-1256898730.file.myqcloud.com/postcard/background/1.jpg',
      header: {
        'content-type': 'image/jepg',
      },
      //filePath: './file',
      success: function(res) {
        if (res.statusCode == 200) {
          console.log('成功', res)
          _this.setData({
            message: res.tempFilePath,
            image_path: res.tempFilePath
          })
          console.log('临时目录', res.tempFilePath)
        }
      },
      fail: function(res) {
        console.log('失败', res)
      },
      complete: function(res) {},
    })
    task.onProgressUpdate((res) => {
      console.log('进度', res.progress,'%')
      console.log('已下载(kb)', (res.totalBytesWritten / 1024).toFixed(2))
      console.log('总大小(kb)', (res.totalBytesExpectedToWrite / 1024).toFixed(2))
    })
  },

  copy: function(e) {
    console.log('复制内容',e)
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