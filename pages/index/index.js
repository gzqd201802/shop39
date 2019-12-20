Page({

  data:{
    swiperImgs:[ ],
    floorData:[ ],
  },

  // 返回顶部
  toTop(){
    // 调用页面滚动 API
    wx.pageScrollTo({
      scrollTop:0
    });
  },
  onLoad(){

    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      success:res=>{
        this.setData({
          swiperImgs: res.data.message
        })
      }
    });
    
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/floordata',
      success:res=>{
        // console.log(res);
        this.setData({
          // 数据统一都是在 res.data.message，后续可以统一封装起来
          floorData: res.data.message
        })
      }
    })

  }
  
})