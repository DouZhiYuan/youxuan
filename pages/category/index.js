import { getRequest } from "../../utils/request";
Page({
  data: {
    // 请求到分类界面的全部数据
    allCateList:[],
    // 左侧的导航菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightProductList:[],
    // 为左侧导航菜单动态添加class属性
    currentIndex:0,
    // 为了解决当右边的商品数据滑到底部时，再点击左侧的菜单导航而不能显示顶部数据的问题
    scrollTop:0,
  },
  // 获取分类页面的数据
  getCatePageData(){
    getRequest("/api/public/v1/categories",{},res=>{
      this.setData({
        allCateList:res.data.message
      });

      // 将请求的数据存入本地
      wx.setStorageSync('cates',{
        "time":Date.now(),
        allCateList:this.data.allCateList
      });

      // 构造左侧的导航菜单数据
      let leftMenuList = this.data.allCateList.map(v => v.cat_name);

      // 构造右侧的商品菜单数据
      let rightProductList = this.data.allCateList[0].children;
      
      this.setData({
        leftMenuList,
        rightProductList
      });

    })
  },

  // 为左侧导航菜单添加点击事件，动态修改currentIndex的值和右侧展示的数据
  leftCateMenu(e){
    this.setData({
      currentIndex:e.currentTarget.dataset.index
    });
    let rightProductList = this.data.allCateList[this.data.currentIndex].children;
    this.setData({
      currentIndex:e.currentTarget.dataset.index,
      rightProductList,
      // 重新设置右侧的scroll-view标签距离顶部的距离
      scrollTop:0
    });
  },

  onLoad: function (options) {
    /***
     * 先判断本地存储中有没有旧数据，如果没有就发送网络请求，如果有就获取本地中的数据，本地存储的数据类型为对象
     * {time:Date.now(),data:[...res.data.message]}
     * */ 
    let Cates = wx.getStorageSync('cates');
    if(!Cates){
      // 没有旧数据
      this.getCatePageData();
    }else if(Date.now() - Cates.time > 1000 * 60 *24 * 3){
      // 数据过期，清空缓存，重新网络请求
      try {
        wx.clearStorageSync();
        this.getCatePageData();
      } catch(e) {
        wx.showToast({
          icon:"loading",
          title:"臣妾正在努力获取数据"
        });
      }
    }else{
      this.data.allCateList = Cates.allCateList;
      let leftMenuList = this.data.allCateList.map(v => v.cat_name);
      let rightProductList = this.data.allCateList[0].children;
      this.setData({
        leftMenuList,
        rightProductList
      });
    }
  }
})