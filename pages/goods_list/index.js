// pages/goods_list/index.js
const app = getApp();
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 商品分页
    pagenum:1,
    // 请求一次的数量
    pagesize:10,
    // 总条数
    total:0,
    // 商品列表
    goods:[],
    // tabs 数据
    activeIndex:0,
    tabs: [
      {
        id: 1,
        name: "综合"
      },
      {
        id: 2,
        name: "销量"
      },
      {
        id: 3,
        name: "价格"
      }
    ]
  },
  // 点击切换 tabs 的索引
  changeIndex(event){
    const { index } = event.currentTarget.dataset;
    this.setData({
      activeIndex:index
    })
  },
  // 页面加载生命函数
  onLoad(options) {
    // 获取列表数据
    this.getList();
  },
  // 把获取列表的业务封装起来
  async getList(){

    let {pagenum,pagesize} = this.data;
    const res = await app.myAxios({
      url:'goods/search',
      data: {
        ...this.options,
        pagenum,
        pagesize
      }
    });

    // 更新页面的列表，并把总数保存起来用于做分页
    this.setData({
      goods: [...this.data.goods, ...res.goods],
      total: res.total
    });
  },
  // 下拉事件
  onPullDownRefresh(){
    // 把商品数组清空，把页码重新变成 1
    this.setData({
      goods:[],
      pagenum:1
    });
    // 重新调用一下 onLoad，重新加载
    this.onLoad();
  },
  // 上拉触底事件
  onReachBottom(){
    // !!!总页数公式：Math.ceil( total / pagesize )
    let { pagenum,total,pagesize  } = this.data;
    // 如果当前页小于总页数
    if(pagenum < Math.ceil( total / pagesize )){
      // pagenum 累加1，再发起请求
      this.setData({
        pagenum: ++pagenum
      });
      // 根据新的页面调用请求数据
      this.getList();
    }else{
      // 消息提示框 - 查 API 手册
      wx.showToast({
        // 提示的内容
        title: '没有更多数据...',
        // 图标
        icon: 'none',
      });
    }
  }
});
