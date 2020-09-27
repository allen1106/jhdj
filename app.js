//app.js
var api = require("/utils/api.js")

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取元数据信息
    // 获取tag列表
    var that = this
    api.phpRequest({
      url: 'label.php',
      success: function (res) {
        var tagList = res.data
        that.globalData.tagList = tagList
      }
    })
    // 获取商品分类列表
    api.phpRequest({
      url: 'category.php',
      success: function (res) {
        var typeList = res.data
        that.globalData.typeList = typeList
      }
    })
  },
  globalData: {
    userInfo: null,
    tagList: null,
    typeList: null
  }
})

// app.js
/**
 * 全局分享配置，页面无需开启分享
 * 使用隐式页面函数进行页面分享配置
 * 使用隐式路由获取当前页面路由，并根据路由来进行全局分享、自定义分享
 */
! function () {
  //获取页面配置并进行页面分享配置
  var PageTmp = Page
  Page = function (pageConfig) {
    //1. 获取当前页面路由
    let routerUrl = ""
    wx.onAppRoute(function (res) {
      //app.js中需要在隐式路由中才能用getCurrentPages（）获取到页面路由
      let pages = getCurrentPages(),
        view = pages[pages.length - 1];
      routerUrl = view.route
    })

    //2. 全局开启分享配置
    pageConfig = Object.assign({
      onShareAppMessage: function () {
        // //根据不同路由设置不同分享内容（微信小程序分享自带参数，如非特例，不需配置分享路径）
        // let shareInfo={}
        // let noGlobalSharePages=["index/index"]
        // //全局分享配置，如部分页面需要页面默认分享或自定义分享可以单独判断处理
        // if (!routerUrl.includes(noGlobalSharePages)){
        //   shareInfo = {
        //     title: "自定义全局分享",
        //     imageUrl: wx.getStorageSync("shareUrl")
        //   }
        // }
        // return shareInfo
        return {
          title: "久航大集"
        }
      }
    }, pageConfig);
    // 配置页面模板
    PageTmp(pageConfig);
  }
}();