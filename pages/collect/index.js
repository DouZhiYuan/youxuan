Page({
  data: {
    tabs:[
      {
        id:0,
        name:"商品收藏",
        isActive:true
      },
      {
        id:1,
        name:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        name:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        name:"浏览足迹",
        isActive:false
      }
    ],
    collect:[],
  },

  // 触发事件的处理函数
  changeCurrentindex(e){
    // 获取点击项的下标
    const {index} = e.detail;
    // 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i === index ? v.isActive=true : v.isActive=false);
    this.setData({
      tabs
    })
  },

  onShow(){
    // 获取缓存中的数据
    const collect = wx.getStorageSync('collect');
    this.setData({
      collect,
    })
  }

})