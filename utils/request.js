// 封装微信小程序的网络请求
// 配置基础网址
const HTTP_BASE_URL = "https://api-hmugo-web.itheima.net";
   
function api(_methods,url,data,callback){
  // 设置加载动画
  wx.showLoading({
    title:"努力加载中...",
    mask:true
  });
  wx.request({
    url: HTTP_BASE_URL+url,
    method: _methods,
    data: data,
    dataType: 'json',
    success: (res)=>{
      // 关闭加载动画
      wx.hideLoading();
      typeof callback == "function" && callback(res, "");
    },
    fail: (res)=>{
      console.log(err)
      typeof callback == "function" && callback(err, "");
    }
  }); 
}
// 导出GET请求
export function getRequest(url,data,callback){
  api('GET',url,data,callback)
}
// 导出POST请求
export function postRequest(url,data,callback){
  api('POST',url,data,callback)
}