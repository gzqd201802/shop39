const app = getApp();
// 在需要使用到  async await 的 js 中，手动引入 runtime.js， regeneratorRuntime 名字不能改
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 在 data 中写的获取也只会触发一次
    address: {},
    cartList: [],
    totalPrice: 0,
  },
  // 1.创建订单的 API 调用，并返回订单编号
  createOrder(){
    const { cartList,address ,totalPrice} = this.data;
    // !!! goods 参数要注意格式，过滤出选中的商品，map 映射成新的数据
    const goods = cartList.filter(v=>v.goods_selected).map(v=>{
      return {
        goods_id: v.goods_id,
        goods_number: v.goods_count,
        goods_price: v.goods_price
      }
    });

    // 发送数据到服务器
    return app.myAxios({
      url:'my/orders/create',
      method:'post',
      data:{ 
        order_price: totalPrice,
        consignee_addr: address.addressDetail,
        goods
     }
    });
  },
  // 2. 准备预支付，获取支付API需要的参数
  getPayParam(order_number){
    return app.myAxios({
      url:'my/orders/req_unifiedorder',
      method:'post',
      data:{ 
        order_number
     }
    });
  },
  // 3. 发起微信支付
  wxPay(pay){
    return new Promise((resolve,reject)=>{
      wx.requestPayment({
        ...pay,
        success:res=>{
          resolve(res);
        },
        fail:err=>{
          reject(err);
          // resolve(err);    // 可以省几分钱
        }
      })
    })
  },
  // 4. 让服务器更新订单支付状态
  checkOrderPay(order_number){
    return app.myAxios({
      url:'my/orders/chkOrder',
      method:'post',
      data:{ 
        order_number
     }
    });
  },
  // 支付流程
  async pay(){
    // 支付流程可能会出现错误，try catch 捕获错误
    try{
      // 1. 创建订单，接收返回的订单编号
      const { order_number } = await this.createOrder();
      // 2. 准备预支付，获取支付API需要的参数
      const { pay } = await this.getPayParam(order_number);
      // 3. 发起微信支付
      await this.wxPay(pay);
      // 4. 支付完成后，服务器更新订单支付状态
      await this.checkOrderPay(order_number);
      // 业务如果能往下运行，说明支付成功，本地存储购物车数据更新，提示用户支付成功并跳转页面
      // 5.1 更新本地存储数据
      const { cartList } = this.data;
      const newCartList = cartList.filter(v=>!v.goods_selected);
      wx.setStorageSync('cartList', newCartList);
      // 5.2 提示用户支付成功
      wx.showToast({
        title: '支付成功,跳转订单页面',
        icon: 'none',
        success:res=>{
          // 支付成功没有就后退，这里使用替换页面
          wx.redirectTo({
            url: '/pages/order/index',
          });
        }
      });
    }catch(error){
      wx.showToast({
        title: '支付失败',
        icon: 'none',
      });
    }

  },
  // 当页面显示的时候
  onShow(){
    // 每次显示后获取最新本地存储数据，并更新到 data 中
    this.setData({
      address: wx.getStorageSync('address') || {},
      cartList: wx.getStorageSync('cartList') || [],
    });
    // 重新计算总价格，全选状态，并更新 cartList 页面数据 和 cartList 本地存储数据
    this.computedCartData();
  },

  // 封装一个计算总价格的函数
  computedCartData(){
    // 解构 data 中的购物车数据
    const { cartList } = this.data;
    // 总价格
    let totalPrice = 0;

    // 计算总价格
    cartList.forEach(v => {
      // 如果是选中的商品
      if(v.goods_selected){
        // 总金额
        totalPrice += v.goods_price * v.goods_count;
      }
    });
    // 更新页面数据
    this.setData({
      totalPrice
    });
  },
})