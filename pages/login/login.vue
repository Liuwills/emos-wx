<template>
	<view>
		<image src="../../static/logo-1.png" class="logo" mode="widthFix"></image>
		<view class="logo-title">EMOS企业在线办公系统</view>
		<view class="logo-subtitle">Ver 2021.8</view>
		<button class="login-btn" open-type="getUserInfo" @tap="login()">登录系统</button>
		<view class="register-container">没有账号？ <text class="register" @tap="toRegister()">立即注册</text></view>
	</view>
</template>

<script>
	export default{
		methods:{
			toRegister(){
				uni.navigateTo({
					url: '../register/register'
				})
			},
			login(){
				let that= this;
				// 搞到临时授权码 this=>Vue
				// uni  wx  vue      vue---->uni----->wx
				uni.login({
					provider:"weixin",
					success:function(resp){ 
						let code = resp.code;  //临时授权码
						that.ajax(that.url.login,"POST",{"code":code},function(resp){
							let permissions = resp.data.permissions;
							uni.setStorageSync("permissions",permissions);
							uni.switchTab({
								url:'/pages/index/index'
							})
							uni.navigateTo({
								url:""
							})
						})
					},fail: function(error){
						uni.showToast({
							icon:'none',
							title: error
						})
					}
				})    
				
			}
			
		}
	}
</script>

<style lang="less">
	@import url("login.less");
</style>
