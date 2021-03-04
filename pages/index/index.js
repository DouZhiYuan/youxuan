const app = getApp();
import { getRequest} from "../../utils/request";
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 分类导航数据
    cateTabList:[],
    // 楼层数据
    floorList:[]
  },
  // 定义方法请求首页轮播图数据
  getSwiperData(){
    getRequest("/api/public/v1/home/swiperdata",{},(res)=>{
      this.setData({
        swiperList:res.data.message
      });
    })
  },

  // 获取分类导航数据
  getCateTabList(){
    getRequest("/api/public/v1/home/catitems",{},(res)=>{
      this.setData({
        cateTabList:res.data.message
      });
    })
  },

  // 获取首页楼层数据
  getFloorData(){
    getRequest("/api/public/v1/home/floordata",{},(res)=>{
      this.setData({
        floorList:res.data.message
      });
    })
  },

  onLoad: function () {
    this.getSwiperData();
    this.getCateTabList();
    this.getFloorData();
  },
})
