// component/search/seach.js
const app = getApp();

Component({
  properties: {},
  data: {},
  methods: {
    getToken(event) {
      console.log(event.detail);
      const {
        encryptedData,
        iv,
        rawData,
        signature,
        userInfo
      } = event.detail;

      wx.login({
        success: (result)=>{
          // console.log(result);
          const { code } = result;

          app.myAxios({
            url:'users/wxlogin',
            method:"post",
            data:{
              encryptedData,
              iv,
              rawData,
              signature,
              code
            }
          }).then(res=>{
            // console.log(res);
            if(res){
              const { token } = res;
              wx.setStorageSync('token', token);
              wx.setStorageSync("userInfo", userInfo);
            }
          })

        }
      });

    }
  }
});
