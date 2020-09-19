const HTTP_HOST = 'https://tchw.17letao.cn'
const API_HOST = HTTP_HOST + '/api/'
const DEBUG = false
const IMG_HOST = DEBUG ? '' : HTTP_HOST
var Mock = require('../utils/mock.js')
function phpRequest(requestParam) {
  if (!DEBUG) {
    var url = requestParam.url
    requestParam.url = API_HOST + url
    if (!requestParam.header) {
      requestParam.header = {
        'content-type': 'application/json'
      }
    }
    wx.request(requestParam)
  } else {
    var fn = requestParam.success
    var url = requestParam.url
    var res = null
    // 模拟数据
    if (url == 'login.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': {
          "userid": 3
        }
      })
    } else if (url == 'category.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': [
          {"cid":"1","name":"\u53a8\u623f\u7528\u5177","img":"/images/guide_1.jpg"},
          {"cid":"2","name":"\u684c\u6905\u677f\u51f3","img":"/images/guide_2.jpg"},
          {"cid":"3","name":"\u5bb6\u5177\u5bb6\u7535","img":"/images/guide_3.jpg"},
          {"cid":"4","name":"\u670d\u88c5\u978b\u5e3d","img":"/images/guide_4.jpg"},
          {"cid":"5","name":"\u624b\u673a\u6570\u7801","img":"/images/guide_5.jpg"},
          {"cid":"6","name":"\u513f\u7ae5\u7528\u5177","img":"/images/guide_6.jpg"},
          {"cid":"7","name":"\u529e\u516c\u8bbe\u65bd","img":"/images/guide_7.jpg"},
          {"cid":"8","name":"\u4e94\u91d1\u7535\u6599","img":"/images/guide_8.jpg"},
          {"cid":"9","name":"\u4ea4\u901a\u5de5\u5177","img":"/images/guide_9.jpg"},
          {"cid":"10","name":"\u5176\u4ed6\u7c7b\u522b","img":"/images/guide_10.jpg"}
        ]
      })
    } else if (url == "adverlist.php") {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': [
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg"," link":"#"},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg"," link":"#"},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg"," link":"#"},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg"," link":"#"},
        ]
      })
    } else if (url == "recommend.php") {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': [
          {"id":"1"," img":"/images/guide_1.jpg"}
        ]
      })
    } else if (url == "products.php") {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': [
          {"id":"1","realname":"张三1","name":"产品标题1","content":"产品介绍1","price":"100","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
          {"id":"2","realname":"张三2","name":"产品标题2","content":"产品介绍2","price":"200","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
          {"id":"3","realname":"张三3","name":"产品标题3","content":"产品介绍3","price":"300","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
          {"id":"4","realname":"张三4","name":"产品标题4","content":"产品介绍4","price":"400","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
        ]
      })
    } else if (url == "detail.php") {
      data = {
        "1": {"id":"1","realname":"张三1","name":"产品标题1","content":"产品介绍1","price":"100","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
        "2": {"id":"2","realname":"张三2","name":"产品标题2","content":"产品介绍2","price":"200","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
        "3": {"id":"3","realname":"张三3","name":"产品标题3","content":"产品介绍3","price":"300","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
        "4": {"id":"4","realname":"张三4","name":"产品标题4","content":"产品介绍4","price":"400","imgs":"/upload/1.jpg|/upload/2.jpg","label":"特价,处理,9成新"},
      }
      var id = requestParam.data.id
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': data[id]
      })
    } else if (url == "collection.php") {
      var id = requestParam.data.id
      console.log(requestParam.data)
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': {
          'status': '1'
        }
      })
    } else if (url == 'collectionlist.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': [
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "10", "name":"产品名称1产品名称1", "id": '1'},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "20", "name":"产品名称2", "id": '2'},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "30", "name":"产品名称3", "id": '3'},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "40", "name":"产品名称4", "id": '4'},
        ]
      })
    } else if (url == 'my_products.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': [
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "10", "name":"产品名称1产品名称1", 'content': '商品描述1', 'label': '特价,9折,热销', "id": '1'},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "20", "name":"产品名称2", 'content': '商品描述2', 'label': '特价,9折,热销', "id": '2'},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "30", "name":"产品名称3", 'content': '商品描述3', 'label': '特价,9折,热销', "id": '3'},
          {"img":"/js/kindeditor/attached/image/20200610/20200610222147_63874.jpg", "price": "40", "name":"产品名称4", 'content': '商品描述4', 'label': '特价,9折,热销', "id": '4'},
        ]
      })
    } else if (url == 'label.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': [
          {"id":1, "name": '特价', 'bg_color': '#46B7FF'},
          {"id":2, "name": '处理', 'bg_color': '#FF8B46'},
          {"id":3, "name": '9成新', 'bg_color': '#51BB3B'},
          {"id":4, "name": '爆款', 'bg_color': '#FF0000'}
        ]
      })
    } else if (url == "buy.php") {
      var id = requestParam.data.id
      console.log(requestParam.data)
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': {
          'status': '1'
        }
      })
    } else if (url == 'info.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': {
          "nickname":"张某某",
          "headimgurl":"http://thirdwx.qlogo.cn/mmopen/ajNVdqHZLLArM70HWicTcZnMbicB6vfibrq1qIfqFr9OTU5c3rUljleeebibEzdxflG95jBxMmcdIyrE9oQw1pgLnQ/132",
          "money":"100",
          "point":"100" ,
          "fbsl":"100",
          "gmsl":"100",
          "mcsl":"100",
          "scsl":"100"
        }
      })
    } else if (url == 'mail.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': {
          "number": 2
        }
      })  
    } else if (url == 'report.php') {
      var list = [
        { "name": "郑州绿地一期", "task_time": "2020年6月1日 20:20:20", id: 1},
        { "name": "郑州绿地二期", "task_time": "2020年6月2日 20:20:20", id: 2},
        { "name": "郑州绿地三期", "task_time": "2020年6月3日 20:20:20", id: 3},
        { "name": "郑州绿地四期", "task_time": "2020年6月4日 20:20:20", id: 4},
        { "name": "郑州绿地五期", "task_time": "2020年6月5日 20:20:20", id: 5},
        { "name": "郑州绿地六期", "task_time": "2020年6月6日 20:20:20", id: 6},
        { "name": "郑州绿地七期", "task_time": "2020年6月7日 20:20:20", id: 7},
        { "name": "郑州绿地八期", "task_time": "2020年6月8日 20:20:20", id: 8},
        { "name": "郑州绿地九期", "task_time": "2020年6月9日 20:20:20", id: 9},
        { "name": "郑州绿地十期", "task_time": "2020年6月10日 20:20:20", id: 10},
        { "name": "郑州绿地十一期", "task_time": "2020年6月11日 20:20:20", id: 11},
        { "name": "郑州绿地十二期", "task_time": "2020年6月12日 20:20:20", id: 12},
      ]
      var pageNum = 8
      var totalPage = Math.ceil(list.length / (pageNum * 1.0))
      var page = requestParam.data.page ? requestParam.data.page : 1
      list = list.slice(pageNum * (page - 1), pageNum * page)
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': list
      })
    } else if (url == "evaluate.php") {
      var list = [
        { "name": "郑州绿地一期", "task_time": "2020年6月1日 20:20:20", id: 1},
        { "name": "郑州绿地二期", "task_time": "2020年6月2日 20:20:20", id: 2},
        { "name": "郑州绿地三期", "task_time": "2020年6月3日 20:20:20", id: 3},
        { "name": "郑州绿地四期", "task_time": "2020年6月4日 20:20:20", id: 4},
        { "name": "郑州绿地五期", "task_time": "2020年6月5日 20:20:20", id: 5},
        { "name": "郑州绿地六期", "task_time": "2020年6月6日 20:20:20", id: 6},
        { "name": "郑州绿地七期", "task_time": "2020年6月7日 20:20:20", id: 7},
        { "name": "郑州绿地八期", "task_time": "2020年6月8日 20:20:20", id: 8},
        { "name": "郑州绿地九期", "task_time": "2020年6月9日 20:20:20", id: 9},
        { "name": "郑州绿地十期", "task_time": "2020年6月10日 20:20:20", id: 10},
        { "name": "郑州绿地十一期", "task_time": "2020年6月11日 20:20:20", id: 11},
        { "name": "郑州绿地十二期", "task_time": "2020年6月12日 20:20:20", id: 12},
      ]
      var pageNum = 8
      var totalPage = Math.ceil(list.length / (pageNum * 1.0))
      var page = requestParam.data.page ? requestParam.data.page : 1
      list = list.slice(pageNum * (page - 1), pageNum * page)
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': list
      })
    }else if (url == "project.php") {
      var list = [
        { "name": "郑州绿地一期", "project_id": 1},
        { "name": "郑州绿地二期", "project_id": 2},
        { "name": "郑州绿地三期", "project_id": 3},
        { "name": "郑州绿地四期", "project_id": 4},
        { "name": "郑州绿地五期", "project_id": 5},
        { "name": "郑州绿地六期", "project_id": 6}
      ]
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': list
      })
    } else if (url == 'system.php') {
      var list = [
        { "name": "智能化系统一期", "industry_id": 1},
        { "name": "智能化系统二期", "industry_id": 2},
        { "name": "智能化系统三期", "industry_id": 3},
        { "name": "智能化系统四期", "industry_id": 4},
        { "name": "智能化系统五期", "industry_id": 5},
        { "name": "智能化系统六期", "industry_id": 6}
      ]
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': list
      })
    } else if (url == 'department.php') {
      var dataList = {
        "事业部": [],
        "区域部": ["二七部", "新郑部"]
      }
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': dataList
      })
    } else if (url == 'user.php'){
      var data = {
        0: [
          {"realname": "张三1", "id": 1},
          {"realname": "李四1", "id": 2},
        ],
        1: [
          {"realname": "张三2", "id": 3},
          {"realname": "李四2", "id": 4}
        ],
        2: [
          {"realname": "张三3", "id": 5},
          {"realname": "李四3", "id": 6},
          {"realname": "王二3", "id": 7},
          {"realname": "麻子3", "id": 8}
        ],
      }
      var ret = data[requestParam.data.departmentid]
      res = Mock.mock({
        'msg': "request:ok",
        'statusCode':200,
        'data': ret
      })
    } else if (url == 'report_submit.php'){
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok'
      })
    } else if (url == 'report_list.php') {
      data = {
        "title": "郑州xxx区房屋漏水",
        "bgbh":"2020060115160001",
        "task_time":"2020年06年01日20:20:20",
        "region":"区域",
        "position":"部位",
        "question":"问题描述",
        "reason":"原因",
        "solve":"解决办法",
        "imgs":"https://xunjian.17letao.cn/js/kindeditor/attached/20200601/202006011243.jpg|https://xunjian.17letao.cn/js/kindeditor/attached/20200601/202006011243.jpg|https://xunjian.17letao.cn/js/kindeditor/attached /20200601/202006011243.jpg",
        "imgs1":" https://xunjian.17letao.cn/js/kindeditor/attached/20200601/202006011243.jpg",
        "report_id":"1"
      }
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': data
      })
    } else if (url == 'evaluate_list.php') {
      var list = [
        {"evaluate_name":"小李","evaluate_time":"2020-06-01 15:32:11","evaluate_content":"评价的内容1"},
        {"evaluate_name":"小张","evaluate_time":"2020-06-01 15:32:11","evaluate_content":"评价的内容2"},
        {"evaluate_name":"小王","evaluate_time":"2020-06-01 15:32:11","evaluate_content":"评价的内容3"},
        {"evaluate_name":"小菜","evaluate_time":"2020-06-01 15:32:11","evaluate_content":"评价的内容4"},
      ]
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': list
      })
    } else if (url == 'statistics.php') {
      var list = [
        {"realname":"张某某","department":"技发部","number":"1"},
        {"realname":"李某某","department":"二七部","number":"3"},
        {"realname":"孙某某","department":"新郑部","number":"12"},
        {"realname":"刘某某","department":"龙子湖部","number":"8"},
      ]
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok',
        'data': list
      })
    } else if (url == 'pay.php') {
      res = Mock.mock({
        'statusCode': 200,
        'errMsg': 'request:ok'
      })
    }
    fn(res);
  }
}
module.exports = {
  HTTP_HOST: HTTP_HOST,
  API_HOST: API_HOST,
  DEBUG: DEBUG,
  IMG_HOST: IMG_HOST,
  phpRequest: phpRequest
}