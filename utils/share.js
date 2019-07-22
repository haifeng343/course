var netUtil = require("request.js"); //require引入
var url = 'user/page/share';
var params = {
  
}
export const shareApi = params => {
  return new Promise((resolve, reject) => {
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      resolve(res)
    }, function (msg) { //onFailed失败回调
      reject(msg)
    }); //调用get方法情就是户数
  })
}
