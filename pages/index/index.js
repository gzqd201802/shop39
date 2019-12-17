Page({

  data:{
    swiperImgs:[]
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

  }
  
})