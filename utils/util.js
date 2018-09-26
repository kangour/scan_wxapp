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

let dtime = '_deadtime';
function putStorage(key, value, time) {
  wx.setStorageSync(key, value)
  var seconds = parseInt(time);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(key + dtime, timestamp + "")
  } else {
    wx.removeStorageSync(key + dtime)
  }
}

function getStorage(key, def) {
  var deadtime = parseInt(wx.getStorageSync(key + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }
  var res = wx.getStorageSync(key);
  if (res) {
    return res;
  } else {
    return def;
  }
}

function removeStorage(key) {
  wx.removeStorageSync(key);
  wx.removeStorageSync(key + dtime);
}

function clearStorage() {
  wx.clearStorageSync();
}


module.exports = {
  formatTime: formatTime,
  setStorage: putStorage,
  getStorage: getStorage,
  removeStorage: removeStorage,
  clearStorage: clearStorage,
}
