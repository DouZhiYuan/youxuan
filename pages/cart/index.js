/**
 * 获取用户对小程序所授予的获取地址权限，获取权限的方法为：wx.getSetting(); 权限状态的关键字时scope.address,在authSetting对象中
 * 1.假设用户在刚开始点击获取收货地址的提示框是“确定”时，scope.address:true
 * 2.假设用户什么都没有点直接返回了，即就没有调用过获取收货地址的api，scope.address:undefined,此时需要诱导用户打开授权界面，让用户重新给与权限
 * 3.假设用户在刚开始点击获取收货地址的提示框是“取消”时，scope.address:false
 * 
 * 获取本地存储中的数据，wxwx.getStorageSync('address')
 */
Page({
  data:{
    // 收货地址数据
    address:{},
    // 购物车数据
    cart:[],
    // 是否全部选中
    allChecked:false,
    // 总价格
    totalPrice:0,
    // 总数量
    totalNum:0,
  },

  // 获取用户的收货地址的步骤
  handleAddress(){
    // 1.获取用户的权限状态
    wx.getSetting({
      success:(res)=>{
        console.log(res);
        // 2.获取授予收货地址的权限状态
        const scopeAdd = res.authSetting["scope.address"];
        if(scopeAdd === true || scopeAdd === undefined){
          // 可以直接调用收货地址代码
          wx.chooseAddress({
            success: (result1) => {
              // 将获取到的收货地址加入缓存
              wx.setStorageSync('address', result1);
            },
          })
        }else{
          // 3.用户之前用户取消过授予权限，此时需要先打开授予界面
          wx.openSetting({
            success:(result2)=>{
              // 可以调用收货地址代码
              wx.chooseAddress({
                success: (result3) => {
                  // 将获取到的收货地址加入缓存
                  wx.setStorageSync('address', result3);
                },
              })
            }
          })
        }
      }

    })
  },

  // 修改收货地址
  changeAddress(){
    wx.showToast({
      title: '功能还未完善',
    })
  },

  // 清空购物车
  clearCart(){
    wx.showModal({
      title: '提示',
      content: '是否清空购物车',
      success: (res)=>{
        if (res.confirm) {
          let cart = [];
          wx.removeStorageSync('cart');
          this.setData({
            cart,
            totalNum:0,
            totalPrice:0,
            allChecked:false
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  // 商品的选中状态
  handleItem(e){
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品的对象下标
    let index = cart.findIndex(v=>v.goods_id === goods_id);
    // 修改选中状态
    cart[index].checked = !cart[index].checked;

    // 将修改后的数据加入缓存
    wx.setStorageSync('cart', cart);

    // 重新计算页面中需要的数据
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked = false;
      }
    });

    // 判断数组是否为空情况下的allChecked的值
    allChecked = cart.length != 0 ? allChecked : false;

     // 修改数据源
     this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
  },

  // 全选按钮的选中与反选
  allChange(){
    // 获取数据源中的数据
    let { cart, allChecked } = this.data;
    // 将这两个数据取反
    console.log(cart);
    allChecked = !allChecked;
    this.setData({
      allChecked
    });
    cart.forEach(v=>v.checked = allChecked);
    // 将修改后的值，添加到data数据源中及缓存中
    // 修改商品总价及数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }
    });
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  },

  // 修改商品数量
  changeNum(e){
    // 获取点击对象的数值及商品id
    let count= e.currentTarget.dataset.count;
    let id= e.currentTarget.dataset.id;
    // 获取数据源cart
    let cart = this.data.cart;
    // 修改数据源中对应商品的信息
    let index = cart.findIndex(v=>v.goods_id == id);
    // 判断是否满足修改的条件
    if(cart[index].num == 1 && count == -1){
      // 删除该商品
      wx.showModal({
        title: '提示',
        content:"您是否要删除该商品",
        success:(res)=>{
          if(res.confirm){
            // 修改数据源及缓存中的数据
            cart.splice(index,1);
            wx.setStorageSync('cart',cart);
            // 修改商品总价
            let totalPrice = 0;
            let totalNum = 0;
            cart.forEach(v=>{
              if(v.checked){
                totalPrice += v.num * v.goods_price;
                totalNum += v.num;
              }
            });
            this.setData({
              cart,
              totalPrice,
              totalNum
            });
          }else if(res.cancel){
            console.log("用户点击了取消")
          }
        }
      })
    }else{
      cart[index].num += count;
      // 修改数据源及缓存中的数据
      wx.setStorageSync('cart', cart);
      // 修改商品总价及数量
      let totalPrice = 0;
      let totalNum = 0;
      cart.forEach(v=>{
        if(v.checked){
          totalPrice += v.num * v.goods_price;
          totalNum += v.num;
        }
      });
      this.setData({
        cart,
        totalPrice,
        totalNum
      });
    };
  },

  // 结算
  handlePay(){
    // 判断是否有收货地址
    const {address,totalNum,totalPrice} = this.data;
    if(!address.userName){
      // 没有收货地址，提醒用户添加收货地址
      wx.showToast({
        title: '您还未添加收货地址',
        icon:'none'
      });
    }else{
      // 已经有了收货地址
      if(totalNum ==0){
        // 没有选中商品
        wx.showToast({
          title: '您还未选中商品',
          icon:'none'
        });
      }else{
        // 已经有了商品，跳转到支付页面
        wx.navigateTo({
          url: '/pages/pay/index',
        })
      }
    }
  },

  onShow(){
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')||{};

    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart')||[];

    // every()操作数组的一个高阶函数，接收一个回调函数作为参数，返回值为Boolean类型。遍历数组，如果每一个回调函数都返回true，那么every方法返回值为true，否则返回值为false。如果一个空数组调用了该方法，其返回值就为true。
    // const allChecked = cart.length > 0 ? cart.every(v => v.checked) : false;

    let allChecked = true;

    // 计算总价和计算总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked = false;
      }
    });

    // 判断数组是否为空情况下的allChecked的值
    allChecked = cart.length != 0 ? allChecked : false;

    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
  },

})