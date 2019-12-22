// pages/goods_detail/index.js
const app = getApp();
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情
    goods_detail:{}
  },
  async onLoad(options){
    // goods/detail
    const res = await app.myAxios({
      url:'goods/detail',
      data: options
    });
    // console.log(res);
    this.setData({
      goods_detail : res
    });

  }
})