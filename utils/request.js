/**
 * 供外部post请求调用
 */
function post(url, params, onSuccess, onFailed, isShowLoading = true, isShowError = true, isnavigateToLogin = true) {
  request(url, params, "POST", onSuccess, onFailed, isShowLoading, isShowError, isnavigateToLogin);
}

/**
 * 供外部get请求调用
 */
function get(url, params, onSuccess, onFailed, isShowLoading = true, isShowError = true, isnavigateToLogin = true) {
  request(url, params, "GET", onSuccess, onFailed, isShowLoading, isShowError, isnavigateToLogin);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onStart 开始请求,初始加载loading等处理
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

const baseUrl = "https://test.guditech.com/rocketclient/";

function request(url, params, method, onSuccess, onFailed, isShowLoading, isShowError, isnavigateToLogin) {
  if (isShowLoading) {
    wx.showLoading({
      title: '玩命加载中...',
    });
  }

  let moment = {};
  var that = this;
  var usertoken = wx.getStorageSync('usertoken'); //wx.getStorageSync(key)，获取本地缓存

  wx.request({
    url: baseUrl + url,
    data: dealParams(params),
    method: method,
    header: {
      'content-type': 'application/json', // 默认值
      'channelCode': 'wechat',
      'appVersion': '1.0.1',
      'userToken': usertoken,
    },
    success: function(res) {
      if (isShowLoading) {
        wx.hideLoading();
      }

      if (res.data) {
        /** start 根据需求 接口的返回状态码进行处理 */
        if (res.data.ErrorCode == 0) {
          if (onSuccess) {
            onSuccess(res.data); //request success
          }
        } else if (res.data.ErrorCode == 301) {
          if (isnavigateToLogin) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        } else if (isShowError) {
          wx.showToast({
            icon: 'none',
            title: res.data.ErrorMessage,
          })
        }
        /** end 处理结束*/
      }
    },

    fail: function(error) {
      if (isShowLoading) {
        wx.hideLoading();
      }

      if (isShowError) {
        wx.showToast({
          icon: 'none',
          title: '网络错误',
        }) //failure for other reasons
      }

      if (onFailed) {
        onFailed(error);
      }
    }
  })
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  return params;
}

module.exports = {
  postRequest: post,
  getRequest: get,
}


//https://www.cnblogs.com/denluoyia/p/9428570.html链接地址