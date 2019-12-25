
// 项目的根路径
const baseUrl = 'https://api.zbztb.cn/api/public/v1/';

// myAxios 函数，params 发请求时传入的参数
export const myAxios = (params)=>{
    // 判断参数的 url 是否有 my/ 路径，如果有，就在请求的时候，给请求头添加 token
    if(params.url.indexOf('my/') !== -1){
        params.header = {};
        // 读取本地存储的 token
        const token = wx.getStorageSync('token');
        // 如果有，就设置请求头
        if(token){
            params.header.Authorization = token;
        }else{
            // 没有 token ，就去用户中心登录
            wx.switchTab({
                url: '/pages/user/index',
            });
            // 防止报错，内部返回空的 promise 对象
            return new Promise(()=>{});
        }
    }
    // 显示加载提示框
    wx.showLoading({
        title: '加载中',
    });

    // 函数内部返回 Promise 实例
    return new Promise((resolve,reject)=>{
        // 对小程序的 request 请求 API 进行封装
        wx.request({
            // 解构所有参数
            ...params,
            // 把原本的 url，变成 根路径 + 目标路径
            url: baseUrl + params.url,
            // 成功
            success:result=>{
                // 对应   .then(res=>{  })
                resolve(result.data.message); 
            },
            // 失败
            fail:error=>{
                // 对应 .catch(err=>{  })
                reject(error);
            },
            // 完成 - 不管成功还是失败都触发
            complete: ()=>{
                // 隐藏提示框
                wx.hideLoading();
                // 请求完毕，下拉刷新结束
                wx.stopPullDownRefresh();
                // 请求完毕，关闭导航栏小菊花
                wx.hideNavigationBarLoading();
            }
        });

    });
}

// PS：小程序支持两种方式导出：
//  1. export 
//  2. module.exports

 
