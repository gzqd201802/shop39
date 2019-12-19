Page({
  data:{
    cateArr: wx.getStorageSync('cateArr') || []
  },

  onLoad(){
    if(this.data.cateArr.length === 0){
      wx.request({
        url:"https://api.zbztb.cn/api/public/v1/categories",
        success:res=>{
          const cateArr =  res.data.message;
          // ❌ 网页端的本地存储写法
          // localStorage.setItem('cateArr', JSON.stringify(cateArr));
          // ✅ 小程序的本地存储写法
          wx.setStorageSync('cateArr', cateArr);
          // 异步版本 - 了解
          // wx.setStorage({
          //   key: "cateArr",
          //   data: cateArr
          // });
          this.setData({
            cateArr
          });
        }
      })
    }
  },
})