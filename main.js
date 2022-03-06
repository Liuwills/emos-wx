import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
//封装API
//定义全局请求路径
let baseUrl = "http://192.168.1.15:8001/emos-wx-api"

//api统一封装
Vue.prototype.url={
	register: baseUrl+"/user/register",
	login: baseUrl+"/user/login",
	validCanCheckIn: baseUrl+"/checkin/validCanCheckIn",
	checkin: baseUrl+"/checkin/checkin",
	createFaceModel: baseUrl+"/checkin/createFaceModel",
	refreshMessage: baseUrl + "/message/refreshMessage",
	searchMessageByPage: baseUrl + "/message/searchMessageByPage",
	searchMessageById: baseUrl + "/message/searchMessageById"
	
}

// this.url.login     http://192.168.5.197:8001/emos-wx-api/user/login




// js 单线程非阻塞模型  fun(resp) 执行函数
// ajax的封装 
Vue.prototype.ajax= function(url,method,data,fun){
	//request: 是微信的api，代表发起一个ajax请求
	uni.request({
		"url":url,
		"method":method,
		"header": {
			// uni.setStroage()  uni.setStroageSync() 同步存储
			'token': uni.getStorageSync('token')        
		},
		"data":data,
		success: function(resp){
			if(resp.statusCode==401){  //如果当前没有权限
				uni.redirectTo({
					url: '../login/login'
				});
			}else if(resp.statusCode==200&&resp.data.code ==200){
				let data = resp.data;
				if(data.hasOwnProperty("token")){
					console.log(resp.data);
					let token = data.token;
					uni.setStorageSync("token",token); //存储服务器端响应的token
				}
				fun(resp)
			}else{
				uni.showToast({
					icon: "none",
					title: resp.data
				})
			}
			//IO ：  阻塞IO  非阻塞IO Netty NIO  多路复用
		}
	})
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
