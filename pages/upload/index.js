let util = require('../../utils/util.js')
// pages/upload/index.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {

  },

  upload: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        wx.uploadFile({
          url: 'https://test.vloop.cc/flask-upload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function(res) {
            var data = res;
            console.log(data);
          },
          fail: function(res) {
            wx.hideToast();
            console.error(res)
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function(res) {}
            })
          }
        });
      }
    });
  },

})
// @app.route('/upload', methods = ['POST'])
// def wxapp_upload():
// return wxapp.upload()

// 方法

// # 关于文件上传的调研（小程序、web都支持）
// UPLOAD_PATH = 'xxx_upload'
// ALLOWED_EXTENSIONS = ['png', 'jpg']

// def allowed_file(filename):
//     return '.' in filename and \
//         filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

// @app.route('/upload', methods=['POST'])
// def upload():
//     import os
//     # http://flask.pocoo.org/docs/0.12/patterns/fileuploads/
//     if request.method == 'POST':
//         # check if the post request has the file part
//         if 'file' not in request.files:
//             logger.debug('No file part')
//             return jsonify({'code': -1, 'filename': '', 'msg': 'No file part'})
//         file = request.files['file']
//         # if user does not select file, browser also submit a empty part without filename
//         if file.filename == '':
//             logger.debug('No selected file')
//             return jsonify({'code': -1, 'filename': '', 'msg': 'No selected file'})
//         else:
//             try:
//                 if file and allowed_file(file.filename):
//                     origin_file_name = file.filename
//                     logger.debug('filename is %s' % origin_file_name)
//                     # filename = secure_filename(file.filename)
//                     filename = origin_file_name
//                     if os.path.exists(UPLOAD_PATH):
//                         logger.debug('%s path exist' % UPLOAD_PATH)
//                         pass
//                     else:
//                         logger.debug('%s path not exist, do make dir' % UPLOAD_PATH)
//                         os.makedirs(UPLOAD_PATH)
//                     file.save(os.path.join(UPLOAD_PATH, filename))
//                     logger.debug('%s save successfully' % filename)
//                     return jsonify({'code': 0, 'filename': origin_file_name, 'msg': ''})
//                 else:
//                     logger.debug('%s not allowed' % file.filename)
//                     return jsonify({'code': -1, 'filename': '', 'msg': 'File not allowed'})
//             except Exception as e:
//                 logger.debug('upload file exception: %s' % e)
//                 return jsonify({'code': -1, 'filename': '', 'msg': 'Error occurred'})
//     else:
//         return jsonify({'code': -1, 'filename': '', 'msg': 'Method not allowed'})