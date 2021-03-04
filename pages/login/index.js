Page({
  handleGetUserInfo(e){
    console.log(e);
    // 获取用户信息
    const {userInfo} = e.detail;
    // 将用户数据存入缓存
    wx.setStorageSync('userInfo', userInfo);
    // 返回上一级
    wx.navigateBack({
      delta: 1,
    });
  },
  handleGetUserPhone(e){
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  goauth(){
    wx.navigateTo({
      url: '../auth/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        someEvent: function(data) {
          console.log(data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  }
})