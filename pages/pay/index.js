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
  // 创建订单的 API 调用
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
  async pay(){
    const res = await this.createOrder();
    console.log(res)
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