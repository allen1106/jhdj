// pages/withdraw/withdraw.js
var api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    money: 0,
    imgCount: 1,
    imgList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      balance: options.balance
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: that.data.imgCount,
      success: function (res) {
        that.setData({
          imgList: that.data.imgList.concat(res.tempFilePaths)
        })
      }
    })
  },

  previewImage: function (e) {
    var that = this
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: that.data.imgList
    })
  },

  delImg: function (e) {
    var that = this
    var current = e.target.dataset.src
    var imgList = that.data.imgList
    var idx = imgList.indexOf(current)
    imgList.splice(idx, 1)
    this.setData({
      imgList: imgList
    })
  },

  validateInfo: function (data) {
    if (!data['money']) return '金额不能为空'
    return 'success'
  },
  
  bindSubmitForm: function (e) {
    console.log(e.detail)
    var that = this

    var data = e.detail.value
    data.userid = wx.getStorageSync('userId')

    var valid = that.validateInfo(data)
    if (valid != "success") {
      wx.showToast({
        title: valid,
        icon: 'none',
      })
      return
    }
    that.uploadImg(data)
  },

  uploadImg: function (data) {
    var that = this
    wx.uploadFile({
      url: api.API_HOST + "fileup.php",
      filePath: that.data.imgList[0],
      name: 'imgs',
      success: function (res) {
        if (typeof(res.data) != Object) {
          res.data = res.data.replace("\ufeff", "")
        }
        res.data = JSON.parse(res.data)
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        } else {
          switch (res.data.status) {
            case 1:
              data['img_url'] = res.data.imgpath
              that.submitForm(data)
              break
            default:
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return
          }
        }
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  },
  submitForm: function (data) {
    // 获取到位置信息后，调用api提交表单
    api.phpRequest({
      url: "withdrawal.php",
      data: data,
      method: 'post',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        console.log(res.data.status)
        if (res.data.status == 1) {
          wx.showToast({
            title: '提现成功',
            icon: 'success',
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.data.status == 2) {
          wx.showToast({
            title: '余额不足',
            icon: 'none'
          })
        } else if (res.data.status == 3) {
          wx.showToast({
            title: '提现失败，您的提现金额超过可提金额',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '提现失败',
            icon: 'none'
          })
        }
      }
    })
  },
})