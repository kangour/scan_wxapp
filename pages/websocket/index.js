let app = getApp()
Page({
  data: {
    ws_url: 'ws://120.1.1.1:8002',
  },

  onLoad: function(options) {
    this.onSocket()
  },
  /**
   * 监听 socket 事件
   */
  onSocket: function() {
    let _this = this
    _this.socketInit()
    wx.onSocketError(res => {
      console.error('出现了一个错误', res)
    })
    wx.onSocketMessage(res => {
      console.warn('收到一个消息', res)
    })
    wx.onSocketClose(res => {
      console.warn('连接已被关闭', res)
    })
  },

  /**
   * 连接 socket
   */
  socketInit: function () {
    console.log('即将 connectSocket')
    wx.connectSocket({
      url: this.data.ws_url,
      data: {},
      method: 'GET',
      success: function(res) {
        console.log("connectSocket 成功2")
      },
      fail: function(res) {
        console.log("connectSocket 失败")
      }
    })
    console.log('即将 onSocketOpen')
    wx.onSocketOpen(function() {
      // callback
      let mCmd = {
        "cmd": "hi",
        "data": {
          a: 11111,
          b: 22222,
          c: 33333,
        }
      }
      wx.sendSocketMessage({
        data: JSON.stringify(mCmd),
        success: function(res) {
          console.log("sendSocketMessage 成功")
        },
        fail: function(res) {
          console.log("sendSocketMessage 失败")
        }
      })
      wx.onSocketMessage(function(data) {
        console.log("onSocketMessage ", data)
      })
    })
  },
})


/**
 * 以下是 python 后端代码
 * 执行前，请运行后端代码并配置好 url。
 * 
import websockets
import asyncio
from datetime import datetime
import time

async def server(websocket, path):
    recv_msg = await websocket.recv()
    print('\n\n--- %s' % datetime.now())
    for i in range(10):
        reply_mag = 'Hello, [%s]' % i
        await websocket.send(reply_mag)
        print("from client :", recv_msg)
        time.sleep(0.5)

if __name__ == '__main__':
    try:
        start_server = websockets.serve(server, '0.0.0.0', 8002)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        pass
 */