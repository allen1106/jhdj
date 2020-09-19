// components/searchInput/search.js
var api = require("../../utils/api.js")

Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      value: null
    },
    bindTapHandler: {
      type: Function,
      value: null,
    },
    /*
    * 控制是买家或者卖家
    * 买家 - 显示‘收藏’和‘购买’按钮
    * 卖家 - 显示‘编辑’和‘删除’按钮
    */
    isClient: {
      type: Number,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemInfo: null,
    bindTapHandler: null,
    isClient: 0,
    showPreview: "none",
    currentIdx: 0,
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
  }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _bindTap: function (e) {
      if (this.data.bindTapHandler) {
        this.data.bindTapHandler(e)
      }
    },
    _bindCollect: function (e) {
      var that = this
      api.phpRequest({
        url: 'collection.php',
        data: {
          goods_id: that.data.itemInfo.id,
          userid: wx.getStorageSync('userId')
        },
        success: function (res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: '收藏失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    },
    _bindPurchase: function (e) {
      var that = this
      api.phpRequest({
        url: 'buy.php',
        data: {
          goods_id: that.data.itemInfo.id,
          userid: wx.getStorageSync('userId')
        },
        success: function (res) {
          if (res.data.status == 1) {
            wx.navigateTo({
              url: '/pages/buyitem/buyitem?orderid=' + res.data.orderid,
            })
          } else if (res.data.status == 2) {
            wx.showToast({
              title: '无法购买自己发布的商品',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '购买失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    },
    _bindEdit: function (e) {
      var that = this
      wx.navigateTo({
        url: '/pages/edititem/edititem?id=' + that.data.itemInfo.id,
      })
    },
    _bindDelete: function (e) {
      var that = this
      api.phpRequest({
        url: 'product_del.php',
        method: 'post',
        header: {'content-type': 'application/x-www-form-urlencoded'},
        data: {
          goods_id: that.data.itemInfo.id
        },
        success: function (res) {
          if (res.data.status == 1) {
            getCurrentPages().pop().onShow()
          } else {
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    },
    previewImg: function (e) {
      var that = this
      var current = e.target.dataset.src
      wx.previewImage({
        current: current,
        urls: that.data.itemInfo.imgs
      })
    },
    // previewImg: function (e) {
    //   var current = e.target.dataset.src
    //   this.setData({
    //     showPreview: "block",
    //     currentIdx: current
    //   })
    // },
    closePreview: function (e) {
      this.setData({
        showPreview: "none"
      })
    },
    toLeft: function (e) {
      this.setData({
        currentIdx: this.data.currentIdx - 1
      })
    },
    toRight: function (e) {
      console.log(this.data.itemInfo.imgs)
      console.log(this.data.currentIdx + 1)
      this.setData({
        currentIdx: this.data.currentIdx + 1
      })
    },
    myCatchTouch: function (e) {
      console.log('stop user scroll it!');
      return
    },
    touchstartCallback: function(e) {
      console.log(e.touches)
      // 单手指缩放开始，也不做任何处理
      if(e.touches.length == 1) {
        // let {clientX, clientY} = e.touches[0];
        // this.startX = clientX;
        // this.startY = clientY;
        // this.touchStartEvent = e.touches;
      } else {
        // 注意touchstartCallback 真正代码的开始
        // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug
        // 当两根手指放上去的时候，就将distance 初始化。
        let xMove = e.touches[1].clientX - e.touches[0].clientX;
        let yMove = e.touches[1].clientY - e.touches[0].clientY;
        let distance = Math.sqrt(xMove * xMove + yMove * yMove);
        console.log(xMove, yMove, distance)
        this.setData({
          'touch.distance': distance,
        })
      }
    },
    touchmoveCallback: function(e) {
      console.log(e.touches)
      let touch = this.data.touch
      // 单手指缩放我们不做任何操作
      if(e.touches.length == 1) {
        
        // if (this.data.stv.zoom) {
        //   //缩放状态，不处理单指
        //   return ;
        // }
        // let {clientX, clientY} = e.touches[0]
        // let offsetX = clientX - this.startX
        // let offsetY = clientY- this.startY
        // this.startX = clientX
        // this.startY = clientY
        // this.setData({
        //   'touch.offsetX': offsetX,
        //   'touch.offsetY': offsetY
        // })
      } else {
        let xMove = e.touches[1].clientX - e.touches[0].clientX;
        let yMove = e.touches[1].clientY - e.touches[0].clientY;
        // 新的 ditance
        let distance = Math.sqrt(xMove * xMove + yMove * yMove);
        let distanceDiff = distance - touch.distance;
        let newScale = touch.scale + 0.005 * distanceDiff
        // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
        if(newScale >= 2) {
            newScale = 2
        }
        if(newScale <= 0.6) {
            newScale = 0.6
        }
        let scaleWidth = newScale * touch.baseWidth
        let scaleHeight = newScale * touch.baseHeight
        // 赋值 新的 => 旧的
        this.setData({
          'touch.distance': distance,
          'touch.scale': newScale,
          'touch.scaleWidth': scaleWidth,
          'touch.scaleHeight': scaleHeight,
          'touch.diff': distanceDiff
        })
      }
    },
    bindload: function(e) {
      // bindload 这个api是<image>组件的api类似<img>的onload属性
      this.setData({
          'touch.baseWidth': e.detail.width,
          'touch.baseHeight': e.detail.height,
          'touch.scaleWidth': e.detail.width,
          'touch.scaleHeight': e.detail.height
      })
    }
  }
})
