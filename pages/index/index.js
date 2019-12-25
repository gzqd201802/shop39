const app = getApp();
// 在需要使用到  async await 的 js 中，手动引入 runtime.js， regeneratorRuntime 名字不能改
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data:{
    swiperImgs:[ ],
    navData:[],
    floorData:[ ],
  },

  // 返回顶部
  toTop(){
    // 调用页面滚动 API
    wx.pageScrollTo({
      scrollTop:0
    });
  },

  async onLoad(){

    const swiperImgs = await app.myAxios({url:'home/swiperdata'});
    const navData = await app.myAxios({url:'home/catitems'});
    const floorData = await app.myAxios({url:'home/floordata'});

    // console.log(swiperImgs,floorData);
    this.setData({ swiperImgs,navData, floorData });
    

    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success:res=>{
    //     this.setData({
    //       swiperImgs: res.data.message
    //     })
    //   }
    // });
    
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/floordata',
    //   success:res=>{
    //     // console.log(res);
    //     this.setData({
    //       // 数据统一都是在 res.data.message，后续可以统一封装起来
    //       floorData: res.data.message
    //     })
    //   }
    // })

  }
  
})