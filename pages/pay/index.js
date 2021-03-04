Page({
  data:{
    // 收货地址数据
    address:{},
    // 购物车数据
    cart:[],
    // 总价格
    totalPrice:0,
    // 总数量
    totalNum:0,
  },

  /** 实现支付的步骤
   * 1、判断缓存中有没有用户的taken值，获取用户的token值需要在接口文档的用户列表中获取
   * 2、如果没有，则跳转到用户授权界面，获取token
   * 3、有token：创建订单
   *     a.
   *     b.
   *     c.
   *     d.
   */
  // 由于微信支付只支持企业账号，此处模拟微信支付
  wxPay(){
    const cart = this.data.cart;
    // 获取缓存中的token值
    const token = wx.getStorageSync('token');
    console.log(token);
    // 缓存中没有token
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }else{
      // 说明已经存在token
      // 获取token
      // const token = wx.getStorageSync('token');
      wx.showModal({
        title: '提示',
        content: '确认支付',
        success (res) {
          if (res.confirm) {
            wx.showToast({
              title: '支付成功',
            });
            // 将已经支付的商品添加到订单页面,     
            wx.setStorageSync('order',cart);
            // 获取缓存中的购物车
            let newCarts = wx.getStorageSync('cart');
            newCarts = newCarts.filter(v=>!v.checked);
            wx.setStorageSync('cart',newCarts);
             // 跳转到订单页面
             wx.navigateTo({
              url: '/pages/order/index',
            });
          }
        }
      })
      
    }
  },

  onShow(){
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')||{};
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart')||[];
    // 支付界面出现的商品应该具有checked属性
    const newCart = cart.filter(v=>v.checked);
    
    // 计算总价和计算总数量
    let totalPrice = 0;
    let totalNum = 0;
    newCart.forEach(v=>{
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      address,
      cart:newCart,
      totalPrice,
      totalNum
    });
  },
})