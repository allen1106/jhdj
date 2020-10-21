// components/edititem/edititem.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js")
const app = getApp()


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemId: {
      type: Number,
      value: null
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgCount: 6,
    imgList: [],
    tagList: [],
    typeList: [],
    typeIdx: 0,
    lng: null,
    lat: null,
    itemId: null,
    itemInfo: null,
    markers: [],
    isagree: false,
    instructions: ''
  },

  /**
   * 组件的生命周期函数
   */
  pageLifetimes: {
    show() {
      var that = this
      console.log(that.data.typeList)

      that.setData({
        typeList: [{'cid': 0, 'name': '请选择分类'}].concat(app.globalData.typeList),
        tagList: app.globalData.tagList
      })

      // 发送请求获取客服电话
      api.phpRequest({
        url: 'phone.php',
        success: function (res) {
          that.setData({
            instructions: res.data.instructions
          })
        }
      })

      if (that.data.itemId && !that.data.itemInfo) {
        api.phpRequest({
          url: 'detail.php',
          data: {
            id: that.data.itemId
          },
          success: function (res) {
            console.log(res.data)
            res.data.imgs = res.data.imgs && res.data.imgs.split(',')
            res.data.label = res.data.label && res.data.label.split(',')
            for (var i in that.data.typeList) {
              if (that.data.typeList[i].cid == res.data.cid) {
                that.data.typeIdx = i
              }
            }
            if (res.data.label) {
              for (var i in that.data.tagList) {
                if (res.data.label.indexOf(that.data.tagList[i].name) != -1) {
                  that.data.tagList[i].checked = true
                }
              }
            }
            that.setData({
              itemInfo: res.data,
              imgList: res.data.imgs,
              lng: res.data.lng,
              lat: res.data.lat,
              typeIdx: that.data.typeIdx,
              tagList: that.data.tagList,
            })
          }
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindTypeChange: function (e) {
      var idx = e.detail.value
      var that = this
      that.setData({
        typeIdx: idx
      })
    },
  
    chooseImage: function (e) {
      var that = this;
      wx.chooseImage({
        count: that.data.imgCount - that.data.imgList.length,
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
  
    bindCheckTag: function (e) {
      var tagIdx = e.currentTarget.dataset.idx
      var tagList = this.data.tagList
      tagList[tagIdx].checked = !tagList[tagIdx].checked
      this.setData({
        tagList: tagList
      })
    },
  
    getCheckedTag: function () {
      var checkedTag = []
      for (var i in this.data.tagList) {
        if (this.data.tagList[i].checked) {
          checkedTag.push(this.data.tagList[i].name)
        }
      }
      return checkedTag
    },
  
    bindGetLoc: function (e) {
      var that = this
      if (that.data.lng && that.data.lat) {
        wx.showToast({
          title: '已获取成功',
        })
        return
      }
      wx.getSetting({
        success: function (res) {
          wx.chooseLocation({
            success (res) {
              that.setData({
                lng: res.longitude,
                lat: res.latitude,
                markers: [{
                  longitude: res.longitude,
                  latitude: res.latitude
                }]
              }, () => {
                wx.showToast({
                  title: '位置获取成功',
                })
              })
            },
            fail: function () {
              wx.showModal({
                title: '警告',
                content: '您没有授权获取位置信息，将无法发布商品。请10分钟后再次点击授权，或者删除小程序重新进入。',
                showCancel: false,
                confirmText: '我知道了'
              })
            },
            complete: (res) => {
              console.log(res)
            },
          })
        }
      })
    },
  
    validateInfo: function (data) {
      if (!data['cid']) return '商品分类'
      if (!data['name']) return '商品名称'
      if (!data['content']) return '商品介绍'
      if (!data['price']) return '商品价格'
      if (!data['number']) return '商品数量'
      if (!data['phone']) return '联系电话'
      if (!data['address']) return '地址'
      if (!data['lat'] || !data['lng']) return '位置信息'
      return 'success'
    },
  
    bindSubmitForm: function (e) {
      console.log(e.detail)
      var that = this
      var url = 'product_fb.php'

      var data = e.detail.value
      data.cid = that.data.typeList[that.data.typeIdx].cid
      data.lng = that.data.lng
      data.lat = that.data.lat
      data.userid = wx.getStorageSync('userId')
      data.label = that.getCheckedTag()
      if (that.data.itemId) data.id = that.data.itemId

      var valid = that.validateInfo(data)
      if (valid != "success") {
        wx.showToast({
          title: valid + '不能为空',
          icon: 'none',
        })
        return
      }
      if (!that.data.isagree) {
        wx.showToast({
          title: '请先同意发布条款',
          icon: 'none',
        })
        return
      }
      that.uploadImg(url, data)
    },
  
    uploadImg: function (url, data) {
      var that = this
      var uploadedImgs = [],
          imgs = this.data.imgList
      for (var i in imgs) {
        // 将已上传的图片剔除，如编辑页面
        if (imgs[i].startsWith(api.HTTP_HOST)) {
          uploadedImgs.push(imgs.splice(i, 1))
        }
      }
      var allImgs = imgs
      if (allImgs.length == 0) {
        data['imgs'] = uploadedImgs
        that.submitForm(url, data)
      } else {
        var i = 0
        that.uploadSingleImg(i, uploadedImgs, imgs, allImgs, url, data)
      }
    },
  
    uploadSingleImg: function (i, uploadedImgs, imgs, allImgs, url, data) {
      console.log(allImgs)
      var that = this
      wx.uploadFile({
        url: api.API_HOST + "fileup.php",
        filePath: allImgs[i],
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
                uploadedImgs.push(res.data.imgpath)
                if (i >= allImgs.length - 1) {
                  data['imgs'] = uploadedImgs
                  that.submitForm(url, data)
                } else {
                  i++
                  that.uploadSingleImg(i, uploadedImgs, imgs, allImgs, url, data)
                }
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
  
    submitForm: function (url, data) {
      var that = this
      // 获取到位置信息后，调用api提交表单
      api.phpRequest({
        url: url,
        data: data,
        method: 'post',
        header: {'content-type': 'application/x-www-form-urlencoded'},
        success: function (res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: that.data.instructions || '发布成功',
              icon: 'success',
              success: function () {
                setTimeout(() => {
                    // 如果是编辑页面则返回上一页，如果是发布则清空数据
                    if (that.data.itemInfo) {
                      that.clearFormData()
                      wx.navigateBack({
                        delta: 1
                      })
                    } else {
                      that.clearFormData()
                      wx.navigateTo({
                        url: '/pages/postlist/postlist',
                      })
                    }
                  }, 1500)
              }
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none'
            })
          }
        }
      })
    },

    clearFormData: function () {
      var that = this
      for (var i in that.data.tagList) {
        that.data.tagList[i].checked = false
      }
      that.setData({
        lat: null,
        lng: null,
        imgList: [],
        tagList: that.data.tagList,
        typeIdx: 0,
        itemInfo: null,
        isagree: false
      })
    },

    bindChooseLoc: function (e) {
      console.log(e)
    },

    navigateToService: function (e) {
      wx.navigateTo({
        url: '/pages/agreement/service',
      })
    },

    checkboxChange: function (e) {
      if (e.detail.value.indexOf('isAgree') != -1) {
        this.setData({
          isagree: true
        })
      } else {
        this.setData({
          isagree: false
        })
      }
    }
  }
})
