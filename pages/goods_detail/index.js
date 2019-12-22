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
  // 预览大图的事件
  previewBigImage(event){
    const { src } = event.currentTarget.dataset;
    // !!! 通过数组的 map 方法，把每一个对象处理成字符串
    const newUrls = this.data.goods_detail.pics.map(v=> v.pics_big);
    console.log(newUrls);
    wx.previewImage({
      current: src,
      urls: newUrls,
    });
  },
  // 页面加载生命周期函数
  async onLoad(options){
    // 向服务器 goods/detail 发起请求，根据 goods_id 获取商品详情
    const res = await app.myAxios({
      url:'goods/detail',
      // options 为页面参数，options 内部保存了 goods_id 参数
      data: options
    });
    // 通过 this.setData() 把请求的数据绑定起来，用于页面渲染
    this.setData({
      goods_detail: res
    });

  }
})