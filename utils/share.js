var netUtil = require("request.js"); //require引入
var url = 'share/info';

function getShare(pageCode, details) {
  if(!pageCode){
    pageCode="common";
  }
  if(!details){
    details=0;
  }
  var params = {
    PageCode: pageCode,
    Details: details
  }
  return new Promise((resolve, reject) => {
    netUtil.postRequest(url,params, function (res) { //onSuccess成功回调、
      resolve(res)
    }, function (msg) { //onFailed失败回调
      reject(msg)
    }); //调用get方法情就是户数
  })
}


module.exports = {
  getShare: getShare,
}

