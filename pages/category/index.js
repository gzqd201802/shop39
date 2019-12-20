// 获取 app.js 中的全局实例 
const app = getApp();

Page({
  data:{
    cateArr: wx.getStorageSync('cateArr') || [],
    cateRight: wx.getStorageSync('cateRight') || [],
    activeIndex: 0,
    rightTop:0,
  },
  // 点击切换索引的事件处理函数
  changeIndex(event){
    // console.log(event);
    const { index } = event.currentTarget.dataset;

    // 小程序更新数据用 this.setData({ })
    this.setData({ 
      rightTop:0,
      activeIndex: index,
      cateRight: this.data.cateArr[index].children
    })


  },

  // 加载生命周期函数
  onLoad(){
    if(this.data.cateArr.length === 0){
      // 调用自己封装的 myAxios 库
      app.myAxios({
        url:'categories',
      }).then(res=>{
            // 现在的 res 就是 之前的 res.data.message 
            const cateArr =  res;
            const cateRight = cateArr[0].children;
            // ✅ 小程序的本地存储写法
            wx.setStorageSync('cateArr', cateArr);
            wx.setStorageSync('cateRight', cateRight);
            // 异步版本 - 了解
            this.setData({
              cateArr,
              cateRight
            });
      });
      // wx.request({
      //   url:"https://api.zbztb.cn/api/public/v1/categories",
      //   success:res=>{
      //     const cateArr =  res.data.message;
      //     const cateRight = cateArr[0].children;
      //     // ❌ 网页端的本地存储写法
      //     // localStorage.setItem('cateArr', JSON.stringify(cateArr));
      //     // ✅ 小程序的本地存储写法
      //     wx.setStorageSync('cateArr', cateArr);
      //     wx.setStorageSync('cateRight', cateRight);
      //     // 异步版本 - 了解
      //     // wx.setStorage({
      //     //   key: "cateArr",
      //     //   data: cateArr
      //     // });
      //     this.setData({
      //       cateArr,
      //       cateRight
      //     });
      //   }
      // })


    }
  },
})