// pages/orderdetail/orderDetial.js
var api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    /**
     * orderInfo中status字段代表订单的状态
     * 1 - 未付款，出现付款按钮
     * 2 - 已付款，出现联系人信息，以及 ‘马上联系’，‘退款’，‘确认取货’ 按钮
     * 3 - 退款申请中，出现提示信息
     * 4 - 退款成功，出现相关提示信息
     * 5 - 取货成功，即交易成功
     * 6 - 订单超时
     * 7 - 发货中
     * 8 - 已送至村代理
     */
    orderInfo: null,
    markers: [],
    statusMapping: {
      "1": "已提交，待付款",
      "2": "已付款，待发货",
      "3": "申请退款中",
      "4": "退款成功",
      "5": "发货中",
      "6": "已送至村代理",
      "7": "已收货",
      "8": "付款超时，取消订单",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.init(id)
  },

  init: function (id) {
    var that = this
    that.setData({
      id: id
    })
    api.phpRequest({
      url: 'order.php',
      data: {
        'userid': wx.getStorageSync('userId'),
        'orderid': id
      },
      success: function (res) {
        res.data.img = res.data.imgs && res.data.imgs.split(',')[0]
        res.data.statusDesc = that.data.statusMapping[res.data.status]
        that.setData({
          orderInfo: res.data,
          markers: [{
            longitude: res.data.lng,
            latitude: res.data.lat
          }]
        })
      }
    })
  },

  bindContact: function (e) {
    var that = this
    wx.showModal({
      title: '联系卖家',  
      showCancel: true,
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: that.data.orderInfo.phone
          })
        }
      }
    })
  },

  bindRefund: function (e) {
    var that = this
    api.phpRequest({
      url: 'refund.php',
      data: {
        'userid': wx.getStorageSync('userId'),
        'orderid': that.data.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '退款提交成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '提交失败，请重试',
            icon: 'none'
          })
        }
      } 
    })
  },

  bindPickup: function (e) {
    var that = this
    api.phpRequest({
      url: 'receipt.php',
      data: {
        'userid': wx.getStorageSync('userId'),
        'id': that.data.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '取货确认成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '确认失败，请重试',
            icon: 'none'
          })
        }
      } 
    })
  },

  bindPay: function () {
    var that = this
    // api.phpRequest({
    //   url: 'wxpay.php',
    //   data: {
    //     userid: wx.getStorageSync('userId'),
    //     orderid: that.data.id
    //   },
    //   method: 'post',
    //   header: {'content-type': 'application/x-www-form-urlencoded'},
    //   success: function (res) {
    //     let payInfo = res.data
    //     wx.requestPayment({
    //       timeStamp: payInfo.timeStamp,
    //       nonceStr: payInfo.nonceStr,
    //       package: payInfo.package,
    //       signType: 'MD5',
    //       paySign: payInfo.paySign,
    //       success (res) {
    //         wx.showToast({
    //           title: '支付成功',
    //         })
    //         that.init(that.data.id)
    //       },
    //       fail (res) {
    //         wx.showToast({
    //           title: '支付失败',
    //         })
    //       }
    //     })
    //   }
    // })
    wx.navigateTo({
      url: '/pages/buyitem/buyitem?orderid=' + that.data.orderInfo.id
    })
  },

  bindOpenLoc: function () {
    var that = this
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//使用微信内置地图查看位置。
          latitude: Number(that.data.orderInfo.lat),//要去的纬度-地址
          longitude: Number(that.data.orderInfo.lng),//要去的经度-地址
          name: '取货地址',
          address: that.data.orderInfo.address
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '请开启GPS位置信息来使用此功能',
          icon: none
        })
      }
    })
  }
})