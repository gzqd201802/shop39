// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: wx.getStorageSync('address') || {}
  },
  // 测试代码 - 获取授权情况
  getSetting(){
    // PS:用户如果在授权的时候点击了拒绝授权，相当于把功能授权情况关闭了
    wx.getSetting({
      success: (result)=>{
        // result 中是用户授权的情况
        console.log(result);
      },
    });
  },
  // 测试代码 - 打开设置界面
  openSetting(){
    wx.openSetting({
      success: (result)=>{
        console.log(result);
      }
    });
  },
  // 获取收货地址终极写法，调用前需要获取用户是否授权
  getAddressHandle(){
    // 1.0 获取用户授权情况
    wx.getSetting({
      success: (result)=>{
        // 1.1 判断用户是否地址没有授权，注意需要用三个等于号
        if(result.authSetting["scope.address"] === false){
          // 2.0 打开设置界面
          wx.openSetting({
            success: (result)=>{
              // 3.0 调用收货地址接口
              this.getAddress();
            }
          });
        }
        // 1.2 如果已经授权
        else{
          // 3.0 调用收货地址接口
          this.getAddress();
        }
      },
    });
  },
  // 获取用户地址信息
  getAddress(){
    // 小程序提供的获取收货地址的API
    wx.chooseAddress({
      success: (result)=>{
        // console.log(result);
        // 从成功的回调函数中提取关键信息
        const {cityName,countyName,detailInfo,nationalCode,postalCode,provinceName,telNumber,userName} = result;
        // 构建一个新的对象
        const address = {
          cityName,
          countyName,
          detailInfo,
          nationalCode,
          postalCode,
          provinceName,
          telNumber,
          userName,
          // 额外拼接了一个新的字符串
          addressDetail:`${provinceName}${cityName}${countyName}${detailInfo}`
        }
        // 把地址信息保存到本地存储
        wx.setStorageSync('address', address);
        // 更新页面数据
        this.setData({
          address 
        });
      },
      // 如果用户拒绝了授权，只会触发调用失败的回调函数
      fail: (err)=>{
        wx.showToast({
          title: '你取消了地址选择',
          icon: 'none'
        });
      }
    });
  }
})