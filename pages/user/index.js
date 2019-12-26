const app = getApp();
// 在需要使用到  async await 的 js 中，手动引入 runtime.js， regeneratorRuntime 名字不能改
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  data: {
    userInfo: {},
    token: ""
  },
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync("userInfo") || {},
      token: wx.getStorageSync("token") || ''
    });
  },
  onLoad(){
    wx.request({
      url: 'https://easy-mock.com/mock/5e0462ce76509b60ee5d01fb/oneList',
    });
  },
  // 分治思想 - 每个功能封装一个独立的函数，分而治之。
  // 获取 code
  getCode() {
    return new Promise((resolve, reject) => {
      // 调用 wx.login() 获取 code, code 发给后端，后端再发给微信服务器。
      // 小程序登录_前后端完整流程_请看文档：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
      wx.login({
        success: result => {
          resolve(result.code);
        }
      });
    });
  },
  // API 调用
  sendUserData(obj) {
    return app.myAxios({
      url: "users/wxlogin",
      method: "post",
      data: obj
    });
  },
  // 获取用户信息，登录 code，换取 token
  async getToken(event) {
    // console.log();
    const { encryptedData, iv, rawData, signature, userInfo } = event.detail;
    // userInfo 有用户头像，和用户昵称，可以保存到本地。
    const code = await this.getCode();
    // 发送用户数据到后端服务器，用于换取 token 值，注意处理登录失败的情况
    const res = await this.sendUserData({
      encryptedData,
      iv,
      rawData,
      signature,
      code
    });
    // 如果 res 有数据，说明登录成功
    if (res) {
      const {token} = res;
      // 把 token 保存到本地
      wx.setStorageSync("token", token);
      // 把用户信息也保存到本地
      wx.setStorageSync("userInfo", userInfo);
      // 更新页面数据
      this.setData({
        token,
        userInfo
      })
      // 提示用户登录成功
      wx.showToast({
        title: "登录成功",
        icon: "none"
      });
    }
    // 登录失败，后台返回 null，走 else 逻辑
    else {
      // 提示用户登录失败
      wx.showToast({
        title: "登录错误，请重试",
        icon: "none"
      });
    }
  }
});
