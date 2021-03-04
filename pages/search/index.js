import {getRequest} from "../../utils/request"
Page({
  data: {
    value:"",
    message:[]
  },
  // 输入值发生改变触发的事件
  handleInput(e){
    // 获取输入框的值
    const {value} = e.detail;
    // 检测输入框值得合法性
    if(!value.trim()){
      // 值不合法
      return
    };
    this.setData({
      value
    })
  },

  // 跳转到商品详情页面
  goGoodsDetail(e){
    const {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../good_detail/index?goods_id='+id,
    })
  },

  // 网络请求
  getSearchData(){
    getRequest('/api/public/v1/goods/qsearch',{
      query:this.data.value
    },res=>{
      this.setData({
        message:res.data.message
      })
    })
  }
})