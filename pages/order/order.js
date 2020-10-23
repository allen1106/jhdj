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
    arr: ["我的卖出", "待付款", "进行中", "交易成功", "退款", "全部订单"],
    swiperHeight: "0rpx",
    currentTab: 0,
    sellItemList: [],
    unPayList: [],
    pendList: [],
    deliverList: [],
    receiveList: [],
    allList: [],
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
    this.fetchSellList()
    this.fetchUnPayList()
    this.fetchPendList()
    this.fetchSuccessList()
    this.fetchRefundList()
    this.fetchAllList()
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
            swiperHeight: 195 * res.data.length + "rpx"
          })
          // var query = that.createSelectorQuery()
          // console.log(query.select('#node').boundingClientRect())
          // query.select('#node').boundingClientRect()
          // query.exec(function (res1) {
          //   let sumHeigth = (res1[0].height + 10) * res.data.length + 'px'
          //   that.setData({
          //     swiperHeight: sumHeigth
          //   })
          // })
        }
      }
    })
  },

  fetchUnPayList: function () {
    var that = this
    that.fetchOrderList(1, (data) => {
      that.setData({
        unPayList: data
      })
    })
  },
  fetchPendList: function () {
    var that = this
    that.fetchOrderList(2, (data) => {
      that.setData({
        pendList: data
      })
    })
  },
  fetchSuccessList: function () {
    var that = this
    that.fetchOrderList(3, (data) => {
      that.setData({
        deliverList: data
      })
    })
  },
  fetchRefundList: function () {
    var that = this
    that.fetchOrderList(4, (data) => {
      that.setData({
        receiveList: data
      })
    })
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
    if (status != 0) {data['status'] = status}
    if (this.data.key) {data['key'] = this.data.key}
    api.phpRequest({
      url: 'orderlist.php',
      data: data,
      success: (res) => {
        for (var i in res.data) {
          res.data[i].img = res.data[i].imgs && res.data[i].imgs.split(',')[0]
        }
        that.setData({
          swiperHeight: 195 * res.data.length + "rpx"
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
      case 1:
        lenth = that.data.unPayList.length
        break;
      case 2:
        lenth = that.data.pendList.length
        break;
      case 3:
        lenth = that.data.deliverList.length
        break;
      case 4:
        lenth = that.data.receiveList.length
        break;
      case 5:
        lenth = that.data.allList.length
        break;
      default:
        break;
    }
    this.setData({
      currentTab: current,
      swiperHeight: 195 * lenth + "rpx"
    })
  },

  changeSwiperTab: function (e) {
    var current = e.detail.current
    this.setData({
      currentTab: current
    })
  }
})