 const formatTime = date => {
   const year = date.getFullYear()
   const month = date.getMonth() + 1
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()
   const second = date.getSeconds()

   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
 }

 const formatNumber = n => {
   n = n.toString()
   return n[1] ? n : '0' + n
 }

 var EARTH_RADIUS = 6378.137; //地球半径
 function rad(d) {
   return d * Math.PI / 180.0;
 }

 /**
  * 将字典转为 url 拼接类型的字符串
  * @param {json} args : 字典参数
  * @returns {string} : 拼接后的 url 参数
  */
 function urlencode(args) {
   let str = "";
   for (let key in args) {
     if (str != "") {
       str += "&";
     }
     str += key + "=" + args[key];
   }
   return str
 }

 function getDistance(lng1, lat1, lng2, lat2) {
   var radLat1 = rad(lat1);
   var radLat2 = rad(lat2);
   var a = radLat1 - radLat2;
   var b = rad(lng1) - rad(lng2);
   var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
     Math.cos(radLat1) * Math.cos(radLat2) *
     Math.pow(Math.sin(b / 2), 2)));
   s = s * EARTH_RADIUS;
   s = Math.round(s * 10000) / 10000;
   return s; //返回数值单位：公里
 }

 var Promise = require('es6-promise.min.js')

 function wxPromisify(fn) {
   return function(obj = {}) {
     return new Promise((resolve, reject) => {
       obj.success = function(res) {
         resolve(res)
       }

       obj.fail = function(res) {
         reject(res)
       }

       fn(obj)
     })
   }
 }

 function findPage(page) {
   let pages = getCurrentPages()
   for (let i in pages)
     if (page == pages[i].route)
       return i - pages.length + 1
   return null
 }

 var getImageInfo = wxPromisify(wx.getImageInfo)
 var downloadFile = wxPromisify(wx.downloadFile)
 var saveFile = wxPromisify(wx.saveFile)
 const app = getApp()


 function checkPostcard(_this, callback) {
   let postcard_pos = wx.getStorageSync("postcard_pos")
   let slogan_pos = wx.getStorageSync("slogan_pos")
   let back_color = wx.getStorageSync("background_color")
   if (postcard_pos === "" || slogan_pos === "" || back_color === "") {
     // No postcard downloaded, use turtle
     // Do nothing
     if (callback)
       callback(_this, false)
   } else {
     Promise.all([getImageInfo({
         src: postcard_pos,
       }), getImageInfo({
         src: slogan_pos,
       })])
       .then(res => {
         if (callback) {
           callback(_this, true)
         } else {
           _this.setData({
             postcard_background: postcard_pos,
             slogan: slogan_pos,
             color: back_color
           })
         }
       })
       .catch(res => {
         console.error(res)
         // No postcard downloaded, use turtle
         // Do nothing
         if (callback)
           callback(_this, false)
       })
   }
 }

 function downloadPostcard(_this, del) {
   wx.showLoading({
     title: '请稍候',
   })
   mini_request('postcard', {}, '/postcard/' + _this.data.id + '.json')()
     .then(res => {
       if (res.statusCode === 200) {
         // _this.setData({ color: res.data.sublayer_color })
         _this.data.color = res.data.sublayer_color
         console.log(res.data)
         return Promise.all([downloadFile({
           url: cdnEncrypt(res.data.background_url),
         }), downloadFile({
           url: cdnEncrypt(res.data.logo),
         })])
       } else {
         throw "Error"
       }
     }).then(res => {
       if (res[0].statusCode === 200 && res[1].statusCode === 200) {
         return Promise.all([saveFile({
           tempFilePath: res[0].tempFilePath,
         }), saveFile({
           tempFilePath: res[1].tempFilePath,
         })])
       } else {
         throw "Error"
       }
     }).then(res => {
       console.log(res[0].savedFilePath)
       console.log(res[1].savedFilePath)
       if (del) {
         wx.removeSavedFile({
           filePath: _this.data.postcard_background,
         })
         wx.removeSavedFile({
           filePath: _this.data.slogan,
         })
       }
       _this.setData({
         color: _this.data.color, // Refresh color
         postcard_background: res[0].savedFilePath,
         slogan: res[1].savedFilePath
       })
       wx.setStorageSync("postcard_pos", res[0].savedFilePath)
       wx.setStorageSync("slogan_pos", res[1].savedFilePath)
       wx.setStorageSync("background_color", _this.data.color)
       return Promise.all([getImageInfo({
         src: res[0].savedFilePath,
       }), getImageInfo({
         src: res[1].savedFilePath,
       })])
     })
     .then(res => {
       _this.setData({
         back_width: res[0].width,
         back_height: res[0].height,
         slo_width: res[1].width,
         slo_height: res[1].height
       })
     })
     .catch(function(reason) {
       console.log(reason)
     })
     .finally(res => {
       wx.hideLoading()
     })
 }

 function cdnEncrypt(url) {
   let address = app.globalData.cdn_config.address
   let path = url.slice(address.length)
   let key = app.globalData.cdn_config.key;
   let t = Math.floor(Date.now() / 1000);
   let sign = md5(key + path + t)
   let ret = address + path + '?sign=' + sign + '&t=' + t
   console.log(path, key, t, sign, ret)
   return ret
 }

 function md5(str) {

   var RotateLeft = function(lValue, iShiftBits) {
     return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
   };

   var AddUnsigned = function(lX, lY) {
     var lX4, lY4, lX8, lY8, lResult;
     lX8 = (lX & 0x80000000);
     lY8 = (lY & 0x80000000);
     lX4 = (lX & 0x40000000);
     lY4 = (lY & 0x40000000);
     lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
     if (lX4 & lY4) {
       return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
     }
     if (lX4 | lY4) {
       if (lResult & 0x40000000) {
         return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
       } else {
         return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
       }
     } else {
       return (lResult ^ lX8 ^ lY8);
     }
   };

   var F = function(x, y, z) {
     return (x & y) | ((~x) & z);
   };
   var G = function(x, y, z) {
     return (x & z) | (y & (~z));
   };
   var H = function(x, y, z) {
     return (x ^ y ^ z);
   };
   var I = function(x, y, z) {
     return (y ^ (x | (~z)));
   };

   var FF = function(a, b, c, d, x, s, ac) {
     a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
     return AddUnsigned(RotateLeft(a, s), b);
   };

   var GG = function(a, b, c, d, x, s, ac) {
     a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
     return AddUnsigned(RotateLeft(a, s), b);
   };

   var HH = function(a, b, c, d, x, s, ac) {
     a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
     return AddUnsigned(RotateLeft(a, s), b);
   };

   var II = function(a, b, c, d, x, s, ac) {
     a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
     return AddUnsigned(RotateLeft(a, s), b);
   };

   var ConvertToWordArray = function(str) {
     var lWordCount;
     var lMessageLength = str.length;
     var lNumberOfWords_temp1 = lMessageLength + 8;
     var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
     var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
     var lWordArray = Array(lNumberOfWords - 1);
     var lBytePosition = 0;
     var lByteCount = 0;
     while (lByteCount < lMessageLength) {
       lWordCount = (lByteCount - (lByteCount % 4)) / 4;
       lBytePosition = (lByteCount % 4) * 8;
       lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
       lByteCount++;
     }
     lWordCount = (lByteCount - (lByteCount % 4)) / 4;
     lBytePosition = (lByteCount % 4) * 8;
     lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
     lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
     lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
     return lWordArray;
   };

   var WordToHex = function(lValue) {
     var WordToHexValue = "",
       WordToHexValue_temp = "",
       lByte, lCount;
     for (lCount = 0; lCount <= 3; lCount++) {
       lByte = (lValue >>> (lCount * 8)) & 255;
       WordToHexValue_temp = "0" + lByte.toString(16);
       WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
     }
     return WordToHexValue;
   };

   var x = Array();
   var k, AA, BB, CC, DD, a, b, c, d;
   var S11 = 7,
     S12 = 12,
     S13 = 17,
     S14 = 22;
   var S21 = 5,
     S22 = 9,
     S23 = 14,
     S24 = 20;
   var S31 = 4,
     S32 = 11,
     S33 = 16,
     S34 = 23;
   var S41 = 6,
     S42 = 10,
     S43 = 15,
     S44 = 21;

   x = ConvertToWordArray(str);
   a = 0x67452301;
   b = 0xEFCDAB89;
   c = 0x98BADCFE;
   d = 0x10325476;

   for (k = 0; k < x.length; k += 16) {
     AA = a;
     BB = b;
     CC = c;
     DD = d;
     a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
     d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
     c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
     b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
     a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
     d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
     c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
     b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
     a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
     d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
     c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
     b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
     a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
     d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
     c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
     b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
     a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
     d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
     c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
     b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
     a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
     d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
     c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
     b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
     a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
     d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
     c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
     b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
     a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
     d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
     c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
     b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
     a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
     d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
     c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
     b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
     a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
     d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
     c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
     b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
     a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
     d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
     c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
     b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
     a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
     d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
     c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
     b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
     a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
     d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
     c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
     b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
     a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
     d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
     c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
     b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
     a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
     d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
     c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
     b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
     a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
     d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
     c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
     b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
     a = AddUnsigned(a, AA);
     b = AddUnsigned(b, BB);
     c = AddUnsigned(c, CC);
     d = AddUnsigned(d, DD);
   }

   var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

   return temp.toLowerCase();
 }

 function jumpToPage(target, jump_type, params) {
   let data = (params == undefined) ? "" : "?" + urlencode(params)
   let url = target + data
   if (jump_type == 'redirect') {
     wx.redirectTo({
       url: url,
     })
   } else if (jump_type == 'navigate') {
     wx.navigateTo({
       url: url,
     })
   } else if (jump_type == 'relaunch') {
     wx.reLaunch({
       url: url,
     })
   } else {
     console.error('jump type unknown')
   }
 }

 function float2str(f) {
   if (f > 1000) {
     return (f / 1000).toFixed(1) + " k"
   } else if (f <= 0) {
     return "-"
   } else {
     return f.toFixed(1)
   }
 }

 /**
  * 将埋点数据发送到服务器和阿拉丁数据统计平台
  * @param {string}   event    : 事件名
  * @param {object}   details  : 事件详细参数
  * @param {function} callback : 回调函数
  */
 function sendEvent(event, details = {}, callback) {
   details.duration = app.globalData.duration
   let args = {
     event: event,
     latitude: app.globalData.latitude,
     longitude: app.globalData.longitude,
     details: details,
   }
   app.aldstat.sendEvent('触发了 ' + event + ' 事件', args)
   mini_request('event', args)()
     .then(res => {
       if (callback) callback()
     })
 }


 /**
  * 弱提示
  * @param  {string} title : 提示的内容
  * @param  {string} icon  : 提示图标
  */
 function showToast(title, icon = 'none', duration = 1500, image = '') {
   wx.showToast({
     title: title,
     image: image,
     icon: icon,
     duration: duration,
   })
 }

 /**
  * confirm_callback function  点击确认按钮后执行
  * cancel_callback  function  点击取消按钮后执行
  */
 function showModal(title, content, confirm_callback, cancel_callback) {
   let show_cancel = cancel_callback == undefined ? false : true
   wx.showModal({
     title: title,
     content: content,
     showCancel: show_cancel,
     success: function(res) {
       if (res.confirm && confirm_callback) {
         confirm_callback()
       }
       if (res.cancel && cancel_callback) {
         cancel_callback()
       }
     },
     fail: function(res) {
       console.error(res)
     }
   })
 }

 /**
  * 封装 Promise 用于控制小程序自带 API 的异步执行流程。
  * callback ：function API 函数名
  * obj ：key-value API 参数
  * 参考链接：
  * https://blog.csdn.net/qq_38125123/article/details/76571719
  * https://blog.csdn.net/happycxz/article/details/75038939
  */
 function mini_promise(callback, obj = {}) {
   return () => {
     return new Promise((resolve, reject) => {
       obj.success = res => {
         if (res.statusCode) {
           if (res.statusCode != 200) {
             console.warn('request object', obj)
             console.error('response', res)
             reject(res)
             return
           }
         }
         // console.log('success', res)
         resolve(res)
       }
       obj.fail = res => {
         console.warn('request object', obj)
         console.error('fail', res)
         reject(res)
       }
       callback(obj)
     })
   }
 }

 /**
  * 封装 Promise 用于控制自定义函数的异步执行流程。
  * 让具有 resolve 和 reject 参数的普通函数直接拥有 Promise 能力，而不影响函数的内部逻辑和结构。
  * callback ：function 函数名
  * args ：array 函数参数
  */
 function nano_promise(callback, args = []) {
   return () => {
     return new Promise((resolve, reject) => {
       args.push(resolve, reject)
       //console.log('args = ', args)
       callback(...args)
     })
   }
 }


 function break_promise(res) {
   return new Promise((resolve, reject) => {
     if (res) {
       reject(res)
     } else {
       reject('break')
     }
   })
 }

 function raise_promise(res) {
   return new Promise((resolve, reject) => {
     if (res) {
       reject(res)
     } else {
       reject('Throw an exception', res)
     }
   })
 }

 function next_promise(res) {
   return new Promise((resolve, reject) => {
     if (res) {
       resolve(res)
     } else {
       resolve('finally')
     }
   })
 }

 function continue_promise() {
   return new Promise((resolve, reject) => {
     reject('continue')
   })
 }

 function sleep(msec, callback) {
   return () => {
     return new Promise((resolve) => setTimeout(() => {
       if (callback) {
         callback()
       }
       resolve('slept ' + msec + ' ms')
     }, msec))
   }
 }

 /**
  * 小程序 API 列表
  */
 const apis = {
   'walking': {
     host: 'https://apis.map.qq.com',
     path: '/ws/direction/v1/walking',
     method: 'GET',
     secrect_key: app.globalData.tencent_lbs_config.secretKey,
   },
   'bag_returned': {
     host: app.globalData.vloop_config.server_address,
     path: '/misc/bag_returned',
     method: 'POST',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'activity': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/activity20180808/activity',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'check_in': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/activity20180808/check_in',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'setting': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/activity20180808/setting',
     method: 'POST',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'gift': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/activity20180808/gift',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'lottery': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/activity20180808/lottery',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'redemption': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/activity20180808/redemption',
     method: 'POST',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'redemption_record': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/activity20180808/redemption_record',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'login': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/login',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'captcha': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/captcha',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'phone_binding': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/phone_binding',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'payment': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/payment',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'withdrawal': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/withdrawal',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'operation': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/operation',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'operation_status': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/operation_status',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'userdata': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/userdata',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'devices': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/devices',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'return_records': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/return_records',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'record_confirmation': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/record_confirmation',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'event': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/event',
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'postcard': {
     host: app.globalData.vloop_config.server_address,
     method: 'GET',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'get_phone_number': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/get_phone_number',
     method: 'POST',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
   'upload': {
     host: app.globalData.vloop_config.server_address,
     path: '/wxapp/upload',
     method: 'POST',
     secrect_key: app.globalData.vloop_config.secrect_key,
   },
 }

 /**
  * 将 url字符串完全解码，防止多次编码对签名验证造成的影响（后端也要这样处理）
  * @param {string} 待解码的 url 字符串。
  */
 function url_fully_decode(url) {
   let _url = decodeURIComponent(url)
   return _url == url ? _url : url_fully_decode(_url)
 }

 /**
  * 将 args 按照字母排序后，获取 md5 签名
  * https://lbs.qq.com/FAQ/key_faq.html#6
  * @param  {string} path      : 请求路径
  * @param  {json}   args    : 请求参数
  * @param  {string} secretKey : 签名密钥
  * @return {json}             : 附加签名的请求参数
  */
 function generate_signature(path, args, secretKey) {
   let data = new Object()
   let keys = Object.keys(args).sort()
   let item = ''
   for (let i in keys) {
     item = args[keys[i]]
     item = ((typeof item).toString() == 'object') ? JSON.stringify(item) : item.toString()
     data[keys[i]] = item.replace(/\s+/g, '')
   }
   data.sig = md5(path + "?" + url_fully_decode(urlencode(data)) + secretKey)
   return data
 }

 /**
  * 传入 API ID 并匹配接口的 url、path、method 和 secrect_key，然后返回 mini_promise 对象。
  * @param  {string}  api  : API ID
  * @param  {json}    args : 请求参数
  * @param  {string}  path : 请求路径（如果没有传，则读取配置）
  * @return {Promise}      : 接口请求对象 mini_promise
  */
 function mini_request(api, args = {}, path = null, need_signature = true) {
   let _path = path || apis[api].path
   let method = apis[api].method
   let host = apis[api].host
   let secrect_key = apis[api].secrect_key
   args.vloop_session_key = wx.getStorageSync('3rd_session')
   // 去除空值
   let data = new Object()
   let item = ''
   for (let key in args) {
     item = args[key]
     if (item || typeof item == 'boolean') {
       data[key] = item
     }
   }
   if (need_signature) {
     data.timestamp = Date.parse(new Date())
     data.nonce_str = Math.random().toString(16).substring(2)
     data = generate_signature(_path, data, secrect_key)
   }
   return mini_promise(wx.request, {
     method: method,
     url: host + _path,
     data: data
   })
 }


 function getextraData() {
   const app = getApp();
   var extraDataValue = {
     appid: app.globalData.baseInfo.appId,
     mch_id: app.globalData.baseInfo.mchId,
     sub_mch_id: app.globalData.baseInfo.subMchId,
     notify_url: app.globalData.baseInfo.notifyUrl,
     contract_code: config.contractCode,
     contract_display_account: app.globalData.baseInfo.contractDisplayAccount,
     plan_id: app.globalData.baseInfo.planId,
     request_serial: config.requestSerial,
     timestamp: config.timestamp,
     sub_appid: app.globalData.baseInfo.subAppId
   };
   var extraDataSortValue = getSort(extraDataValue);
   var signValue = getSign(extraDataSortValue, app.globalData.baseInfo.appSecret);
   extraDataValue['sign'] = signValue;
   log(TAG, "signSign=[" + signValue + "]length=" + String(signValue).length);
   return extraDataValue;
 }



 module.exports = {
   formatTime: formatTime,
   getDistance: getDistance,
   wxPromisify: wxPromisify,
   Promise: Promise,
   findPage: findPage,
   checkPostcard: checkPostcard,
   downloadPostcard: downloadPostcard,
   cdnEncrypt: cdnEncrypt,
   urlencode: urlencode,
   sleep: sleep,
   jumpToPage: jumpToPage,
   float2str: float2str,
   showModal: showModal,
   showToast: showToast,
   mini_promise: mini_promise,
   nano_promise: nano_promise,
   next_promise: next_promise,
   mini_request: mini_request,
   sendEvent: sendEvent,
   getextraData: getextraData,
 }