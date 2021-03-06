// pages/buyitem/buyitem.js
var api = require("../../utils/api.js")

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    itemInfo: null,
    pickAddrList: [
      {"shopname": "请选择取货地址", "id": 0}
    ],
    pickIdx: 0,
    agentId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var orderId = options.orderid
    that.setData({
      orderId: orderId
    })
    that.fetchPickAddrList()
    that.setData({
      pickIdx: app.globalData.pickIdx
    })
    api.phpRequest({
      url: 'pay.php',
      data: {
        'userid': wx.getStorageSync('userId'),
        'orderid': orderId
      },
      success: function (res) {
        res.data.img = res.data.imgs && res.data.imgs.split(',')[0]
        that.setData({
          itemInfo: res.data,
        })
      }
    })
  },

  fetchPickAddrList: function () {
    var that = this
    // 获取部门信息
    api.phpRequest({
      url: 'agent.php',
      success: function (res) {
        var departList = that.data.pickAddrList.concat(res.data)
        console.log(departList)
        that.setData({
          pickAddrList: departList
        })
      }
    })
  },

  bindPickChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      pickIdx: idx,
      agentId: that.data.pickAddrList[idx].id
    }, () => {
      app.globalData.pickIdx = idx
      console.log(app.globalData)
    })
  },

  validateInfo: function (data) {
    if (!data['name']) return '收货人姓名'
    if (!data['tel']) return '收货人电话'
    if (!data['address']) return '收货人地址'
    return 'success'
  },

  bindPay: function (e) {
    var that = this
    var data = e.detail.value
    var valid = that.validateInfo(data)
    if (valid != "success") {
      wx.showToast({
        title: valid + '不能为空',
        icon: 'none',
      })
      return
    }
    api.phpRequest({
      url: 'wxpay.php',
      data: {
        userid: wx.getStorageSync('userId'),
        orderid: that.data.orderId,
        agentid: that.data.agentId,
        people: data['name'],
        tel: data['tel'],
        address: data['address'],
      },
      method: 'post',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        let payInfo = res.data
        wx.requestPayment({
          timeStamp: payInfo.timeStamp,
          nonceStr: payInfo.nonceStr,
          package: payInfo.package,
          signType: 'MD5',
          paySign: payInfo.paySign,
          success (res) {
            wx.showToast({
              title: '支付成功',
            })
            wx.navigateTo({
              url: '/pages/orderdetail/orderdetail?id=' + that.data.orderId
            })
          },
          fail (res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      }
    })
  }
})