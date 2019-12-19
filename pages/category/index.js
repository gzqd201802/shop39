Page({
  data:{
    cateArr: wx.getStorageSync('cateArr') || [],
    cateRight: wx.getStorageSync('cateRight') || [],
    activeIndex: 0
  },
  // 点击切换索引的事件处理函数
  changeIndex(event){
    // console.log(event);
    const { index } = event.currentTarget.dataset;

    // 小程序更新数据用 this.setData({ })
    this.setData({ 
      activeIndex: index,
      cateRight: this.data.cateArr[index].children
    })


  },

  // 加载生命周期函数
  onLoad(){
    if(this.data.cateArr.length === 0){
      wx.request({
        url:"https://api.zbztb.cn/api/public/v1/categories",
        success:res=>{
          const cateArr =  res.data.message;
          const cateRight = cateArr[0].children;
          // ❌ 网页端的本地存储写法
          // localStorage.setItem('cateArr', JSON.stringify(cateArr));
          // ✅ 小程序的本地存储写法
          wx.setStorageSync('cateArr', cateArr);
          wx.setStorageSync('cateRight', cateRight);
          // 异步版本 - 了解
          // wx.setStorage({
          //   key: "cateArr",
          //   data: cateArr
          // });
          this.setData({
            cateArr,
            cateRight
          });
        }
      })
    }
  },
})