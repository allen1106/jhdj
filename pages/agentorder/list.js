// pages/order/order.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    searchHandler: null,
    arr: ["全部订单"],
    swiperHeight: "0rpx",
    currentTab: 0,
    allList: [],
    bindNavToOrderHandler: util.navToOrderDetail,
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
    this.setData({
      searchHandler: this.searchHandler
    })
    var tabid = options.tabid
    this.setData({
      currentTab: tabid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.fetchData()
  },

  searchHandler: function (seachWords) {
    this.setData({
      key: seachWords.trim()
    }, () => {
      this.fetchData()
    })
  },

  fetchData: function () {
    this.fetchAllList()
  },

  fetchAllList: function () {
    var that = this
    that.fetchOrderList(0, (data) => {
      that.setData({
        allList: data
      })
    })
  },

  fetchOrderList: function (status, fn) {
    var that = this
    var data = {
      userid: wx.getStorageSync('userId')
    }
    if (this.data.key) {data['key'] = this.data.key}
    api.phpRequest({
      url: 'shoporder.php',
      data: data,
      success: (res) => {
        for (var i in res.data) {
          res.data[i].img = res.data[i].imgs && res.data[i].imgs.split(',')[0]
          res.data[i].status = that.data.statusMapping[res.data[i].status]
        }
        that.setData({
          swiperHeight: 220 * res.data.length + "rpx"
        })
        fn(res.data)
      }
    })
  },

  swichNav(e){
    var that = this
    var current = e.currentTarget.dataset.current
    var lenth = 0
    switch (current) {
      case 0:
          lenth = that.data.sellItemList.length
          break;
      default:
        break;
    }
    this.setData({
      currentTab: current,
      swiperHeight: 220 * lenth + "rpx"
    })
  },

  changeSwiperTab: function (e) {
    var current = e.detail.current
    this.setData({
      currentTab: current
    })
  }
})