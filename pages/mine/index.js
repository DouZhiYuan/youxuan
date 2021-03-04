Page({
  data:{
    userInfo:{},
    collect_num:0,
  },

  // 收货地址管理功能
  addressManagement(){
    wx.showModal({
      title:"提示",
      content:"是否清空地址",
      success (res) {
        if (res.confirm) {
          // 清空缓存中的收货地址
          wx.removeStorageSync('address');
          wx.showToast({
            title: '清空成功',
          });
        }
      }
    })
  },

  // 点击头像取消登录
  cancelLogin(){
    wx.showModal({
      title:"提示",
      content:"是否取消登录",
      success: (res)=> {
        if (res.confirm) {
          // 清空缓存中的用户信息
          wx.removeStorageSync('userInfo');
          this.setData({
            userInfo:{}
          })
        }
      }
    })
  },

  // 联系客服
  callCustomer(){
    wx.makePhoneCall({
      phoneNumber: '18137573865',
    })
  },
  
  onShow: function () {
    // 获取缓存中的数据
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    });

    // 获取缓存中的收藏数据
    const collect = wx.getStorageSync('collect');
    this.setData({
      collect_num:collect.length
    })
  },

})