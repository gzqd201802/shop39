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
  goToCart(){
    // 用于跳转 tabBar 页的 API
    wx.switchTab({
      url: '/pages/cart/index',
    });
  },
  // 添加购物车
  addToCart(){
    // 解构 商品名称，商品图片，商品价格，商品 id
    // 额外还需要：商品选中状态，商品数量
    const { goods_name,goods_price,goods_id,goods_small_logo } = this.data.goods_detail;
    // 注意事项：两种情况
    // 0. 读取本地存储购物车数据
    const cartList = wx.getStorageSync('cartList') || [];
    // !!! findIndex 如果查找不存在就返回 -1，如果查找存在就返回数据所在的索引值
    const index = cartList.findIndex(v=>{
      return v.goods_id === goods_id;
    })
    // 1. 商品不存在的情况
    if(index === -1){
      // 添加新的数组到数组中
      cartList.push({
        // 解构得到的数据
        goods_name,
        goods_price,
        goods_id,
        goods_small_logo,
        // 商品选中状态，商品数量
        goods_selected: true,
        goods_count:1,
      });
    }
    // 2. 商品已经存在的情况
    else{
      cartList[index].goods_count++;
    }

    // 更新本地存储数据
    wx.setStorageSync('cartList', cartList);

    // 添加成功后，显示消息提示框
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      // 持续时间
      duration: 500,
      // 是否防止触摸穿透
      mask: true
    });

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
    // 如果是 ios 操作系统，通过正则表达式吧 webp 图片路径替换
    const { platform } =  wx.getSystemInfoSync();
    // console.log(system);
    if(platform === 'ios'){
      // .+?   匹配多个任意字符，并阻止贪婪模式(最近一个webp结束)
      res.goods_introduce = res.goods_introduce.replace(/\?.+?webp/g,'')
    }
    // 通过 this.setData() 把请求的数据绑定起来，用于页面渲染
    this.setData({
      goods_detail: res
    });

  }
})