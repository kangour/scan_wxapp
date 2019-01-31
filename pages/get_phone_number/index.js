// pages/get_phone_number/index.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  }, 

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    let iv = e.detail.iv
    let encrypted_data = e.detail.encryptedData
    util.mini_request('get_phone_number', {
      iv: iv,
      encrypted_data: encrypted_data,
    })()
  },
//  后端代码：
//   WXBizDataCrypt.py
// import base64
// import json
// from Crypto.Cipher import AES


// class WXBizDataCrypt:
//   def __init__(self, appId, sessionKey):
//   self.appId = appId
//         self.sessionKey = sessionKey

//     def decrypt(self, encryptedData, iv):
//   # base64 decode
//         sessionKey = base64.b64decode(self.sessionKey)
//         encryptedData = base64.b64decode(encryptedData)
//         iv = base64.b64decode(iv)
//         cipher = AES.new(sessionKey, AES.MODE_CBC, iv)

//         data = self._unpad(cipher.decrypt(encryptedData))
//         decrypted = json.loads(data.decode("utf-8"))

//         if decrypted['watermark']['appid'] != self.appId:
//   raise Exception('Invalid Buffer')

//         return decrypted

//     def _unpad(self, s):
//   return s[:- ord(s[len(s) - 1:])]


// 路由
// @app.route('/wxapp/get_phone_number', methods = ['POST'])
// def wxapp_get_phone_number():
//     return wxapp.get_phone_number()
 
//  方法
//  def get_phone_number():
//     from.WXBizDataCrypt import WXBizDataCrypt
//     iv = request.args.get('iv')
//     encrypted_data = request.args.get('encrypted_data')
//     vloop_session_key = request.args.get('vloop_session_key')
//     user = User.objects.get(vloop_session_key = vloop_session_key)
//     session_key = user.wxapp_session_key
//     appid = config.appid

//     logger.debug("iv %s" % iv)
//     logger.debug("encrypted_data %s" % encrypted_data)
//     logger.debug("appid %s" % appid)
//     logger.debug("session_key %s" % session_key)

//     pc = WXBizDataCrypt(appid, session_key)
//     data = pc.decrypt(encrypted_data, iv)
//     phone_number = data['phone_number']
//     logger.debug("pc %s" % phone_number)
//     return jsonify('SUCCESS')
})