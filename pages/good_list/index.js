import { getRequest } from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 传递给TabBar组件的数据
    tabs:[
      {
        id:0,
        name:"综合",
        isActive:true
      },
      {
        id:1,
        name:"销量",
        isActive:false
      },
      {
        id:2,
        name:"价格",
        isActive:false
      }
    ],
    // 网络请求需要传入的数据,也是前一个页面传过来的数据
    cid:'',
    // 存储网络请求的数据
    goodsList:[],

  },
  // 总页数
  totalPages:1,
  // 一次请求的数据条数
  pagesize:8,
  // 当前的数据处于第几次请求
  pagenum:1,

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
  // 网络请求
  getGoodsListData(){
    getRequest("/api/public/v1/goods/search",{
      query:'',
      cid:this.data.cid,
      pagenum:this.pagenum,
      pagesize:this.pagesize
    },(res)=>{
      // 关闭下拉刷新的窗口
      wx.stopPullDownRefresh();
      // 计算总页数
      this.totalPages = Math.ceil(res.data.message.total/this.pagesize);
      this.setData({
        goodsList:[...this.data.goodsList,...res.data.message.goods]
      })
    })
  },
  onLoad: function (options) {
    this.data.cid = options.cid;
    this.getGoodsListData();
  },

  //下拉刷新 
  onPullDownRefresh: function () {
    this.data.goodsList = [];
    this.pagenum = 1;
    this.getGoodsListData();
  },

  // 上拉加载更多
  onReachBottom: function () {
    // 判断还有没有下一页数据
    if(this.pagenum >= this.totalPages){
      // 没有下一页数据
      wx.showToast({
        title: '没有更多数据了',
      })
      
    }else{
      // 还有下一页数据
      this.pagenum ++;
      this.getGoodsListData();
    }
  },
})