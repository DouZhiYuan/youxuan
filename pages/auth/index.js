import {postRequest} from "../../utils/request"
Page({
  data:{
    code:'',
    appid:"wx6b0bf36d7cb60964",
    secret:"a5a9fcf799e2156001f4a8384c14a448",
    grant_type:"authorization_code"
  },
  getUserInfo(e){
    console.log(e);
    // 获取小程序登录成功后的code值
    wx.login({
      timeout: 10000,
      success:(res)=>{
        console.log(res);
        this.setData({
          code:res.code
        })
        wx.nextTick(()=>{
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+this.appid+'&secret='+this.secret+'&js_code='+this.code+'&grant_type=authorization_code',
            method:"GET",
            success:(res)=>{
              console.log(res)
            }
          });
        })
        
      }
    });
    
    
  }
})