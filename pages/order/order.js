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
    arr: ["卖出的", "买到的", "进行中"],
    swiperHeight: "0rpx",
    currentTab: 0,
    sellItemList: [],
    buyItemList: [],
    pendItemList: [],
    bindNavToOrderHandler: util.navToOrderDetail,
    bindNavToSellHandler: util.navToSellDetail,
    statusDescList: ["待支付", "待收货", "退款中", "已退款", "已收货", "已取消"]
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
    that.fetchSellList()
    that.fetchBuyList()
    that.fetchPendingList()
  },

  searchHandler: function (seachWords) {
    this.setData({
      key: seachWords.trim()
    }, () => {
      this.fetchSellList()
      this.fetchBuyList()
      this.fetchPendingList()
    })
  },

  fetchSellList: function () {
    var that = this
    var data = {
      userid: wx.getStorageSync('userId')
    }
    if (that.data.key) {data['key'] = that.data.key}
    api.phpRequest({
      url: 'selllist.php',
      data: data,
      success: (res) => {
        for (var i in res.data) {
          res.data[i].img = res.data[i].imgs && res.data[i].imgs.split(',')[0]
        }
        that.setData({
          sellItemList: res.data
        })
        if (that.data.currentTab == 0) {
          that.setData({
            swiperHeight: 220 * res.data.length + "rpx"
          })
        }
      }
    })
  },

  fetchBuyList: function () {
    var that = this
    that.fetchOrderList(0, (res) => {
      for (var i in res.data) {
        res.data[i].img = res.data[i].imgs && res.data[i].imgs.split(',')[0]
      }
      that.setData({
        buyItemList: res.data
      })
      console.log(that.data.currentTab)
      if (that.data.currentTab == 1) {
        that.setData({
          swiperHeight: 220 * res.data.length + "rpx"
        })
      }
    })
  },

  fetchPendingList: function () {
    var that = this
    that.fetchOrderList(1, (res) => {
      for (var i in res.data) {
        res.data[i].img = res.data[i].imgs && res.data[i].imgs.split(',')[0]
      }
      that.setData({
        pendItemList: res.data
      })
      if (that.data.currentTab == 2) {
        that.setData({
          swiperHeight: 220 * res.data.length + "rpx"
        })
      }
    })
  },

  fetchOrderList: function (status, fn) {
    var data = {
      userid: wx.getStorageSync('userId'),
      status: status
    }
    if (this.data.key) {data['key'] = this.data.key}
    api.phpRequest({
      url: 'orderlist.php',
      data: data,
      success: fn
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
      case 1:
        lenth = that.data.buyItemList.length
        break;
      case 2:
        lenth = that.data.pendItemList.length
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