// pages/order/index.js
Page({
  data:{
    order:[],
  },
  goGoodsDetail(e){
    const {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../good_detail/index?goods_id='+id,
    })
  },
  onShow(){
    // 获取缓存中的订单数据
    const order = wx.getStorageSync('order');
    this.setData({
      order
    })
  },
})