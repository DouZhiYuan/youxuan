import { getRequest } from "../../utils/request";
Page({
  data: {
    // 存储上一个页面传递的商品id，
    goods_id:'',
    // 存储商品详情信息
    goodsDetailInfo:{},
    // 获取购物车中商品的数量
    goods_count:0,
    isCollect:false,
    // 当请求的数据中不含有轮播图图片时，使用此处的图片
    swiperImg:[
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601302777698&di=62dd46f230270b40f655b3b25f51f016&imgtype=0&src=http%3A%2F%2Fwww.wfuyu.com%2Fuploadfile%2Fcj%2F20141130%2Fcd70ec786aa669ee4d472073cf52c76a.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601302889713&di=92f4ea4ad7ce9454af4a83281a3528ac&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2FBizhi%2Fmn1_1366.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601302889713&di=004ffbc2e093208211d9ba3caf099d59&imgtype=0&src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201111%2F01%2F131423x5n9f11x30s9zfqm.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601302889713&di=de55993837a906ca68084e3b25e02661&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fc995d143ad4bd113cce8af145bafa40f4bfb05ea.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601302889712&di=adbf8d0a44f2e08f1b020dda18e424ad&imgtype=0&src=http%3A%2F%2Fww2.sinaimg.cn%2Fmw690%2F7968c17bgw1ecauvn3m5pj20b80gvq3p.jpg"
    ],
    // 立即购买界面是否出现
    isShow:false,
  },

  //定义方法获取商品详情信息
  getGoodsDetailInfo(){
    getRequest("/api/public/v1/goods/detail",{
      goods_id:this.data.goods_id
    },res=>{
      console.log(res);
      // 获取缓存中商品收藏数组
      let collect = wx.getStorageSync('collect')||[];
      // 判断当前商品是否在该数组中
      let isCollect = collect.some(v=>v.goods_id == res.data.message.goods_id);

      this.setData({
        goodsDetailInfo:{
          goods_number:res.data.message.goods_number,
          goods_name:res.data.message.goods_name,
          goods_price:res.data.message.goods_price,
          // 部分iphone手机不支持webp格式的图片，如果后台确定存在jgp或者png格式的图片，在前端可以自己修改图片的格式
          goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics:res.data.message.pics,
          goods_id:res.data.message.goods_id,
        },
        isCollect
      });
    });
  }, 

  // 点击轮播图实现放大预览
  handlePreviewImage(e){
    let urls = [];
    if(this.data.goodsDetailInfo.pics.length > 0){
      urls = this.data.goodsDetailInfo.pics.map(v =>  v.pics_mid);
    }else{
      urls = this.data.swiperImg.map(v=>v);
    }
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      urls,
      current
    })
  },

  // 加入购物车:思路，将该商品的信息（this.data.goodsDetailInfo）加入本地缓存，并且在购物车界面取出缓存数据展示
  addToCart(){
    // 首先获取缓存中的购物车数组，防止同一商品频繁添加
    let cart = wx.getStorageSync('cart')||[];
    // 判断该商品是否存在于购物车缓存数组中
    let index = cart.findIndex(v => v.goods_id === this.data.goodsDetailInfo.goods_id);
    if(index === -1){
      // 不存在，第一次添加数据
      this.data.goodsDetailInfo.num = 1;
      this.data.goodsDetailInfo.checked = true;
      this.data.goods_count++;
      this.setData({
        goods_count:this.data.goods_count
      });
      cart.push(this.data.goodsDetailInfo);
    }else{
      // 已经存在购物车数据
      cart[index].num++;
      this.data.goods_count++;
      this.setData({
        goods_count:this.data.goods_count
      });
    }
    // 将购物车重新添加到缓存
    wx.setStorageSync('cart', cart);
    // 提示信息
    wx.showToast({
      title: '添加购物车成功',
      mask:true,
      icon:'success'
    })
  },

  // 收藏的实现
  collectBtn(){
    // 获取缓存中的商品收藏数组
    let collectArr = wx.getStorageSync('collect')||[];
    // 判断该商品是否被收藏过,获取下标
    let index = collectArr.findIndex(v=>v.goods_id == this.data.goodsDetailInfo.goods_id);
    if(index != -1){
      // 该商品已经收藏过，删除该商品
      collectArr.splice(index,1);
      this.setData({
        isCollect:false
      });
      wx.showToast({
        title: '取消收藏',
        mask:true
      });
    }else{
      collectArr.push(this.data.goodsDetailInfo);
      // 修改data当中的isCollect属性
      this.setData({
        isCollect:true
      });
      wx.showToast({
        title: '收藏成功',
        mask:true
      });
    }
    // 将该数组加入缓存
    wx.setStorageSync('collect', collectArr);
  },

  // 立即购买
  onTimeBy(){
    // 显示提示框
    this.setData({
      isShow:true
    })
  },

  // 控制立即购买是否显示
  showAndHidden(){
    this.setData({
      isShow:!this.data.isShow
    })
  },

  goPay(){
    this.setData({
      isShow:!this.data.isShow
    });
    wx.showToast({
      title: '暂不支持',
      icon:'none'
    });
  },

  onShow(){
    // 通过小程序页面栈获取前一个页面传过来的参数
    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    // 数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    this.setData({
      goods_id:options.goods_id
    });
    this.getGoodsDetailInfo();
    

    // 获取购物车中的数据量
    let cars = wx.getStorageSync('cart');
    if(cars.length == 0){
      this.data.goods_count = 0;
    }else{
      let num = 0;
      for(let item of cars){
        num += item.num;
      }
      this.data.goods_count = num;
      this.setData({
        goods_count:this.data.goods_count
      });
    };
  },
})