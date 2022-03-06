<template>
	<view>
		<!-- 摄像头 -->
		<camera device-position="front" flash="off" class="camera" @error="error" v-if="showCamera"></camera>
		<!-- 在拍照完成后显示拍好的照片 -->
		<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
		<view class="operate-container">
			<button type="primary" class="btn" @tap="clickBtn" :disabled="!canCheckin">{{ btnText }}</button>
			<button type="warn" class="btn" @tap="afresh" :disabled="!canCheckin">重拍</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。</text>
		</view>
	</view>
</template>

<script>
let QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
let qqmapsdk;
export default {
	data() {
		return {
			canCheckin: true,
			photoPath: '',
			btnText: '签到',
			showCamera: true,
			showImage: false
		};
	},
	onLoad: function(){
		qqmapsdk = new QQMapWX({
			key:"F3GBZ-77Z3U-BMRV6-BOYGZ-QL5HF-52F7T"
		})
	},
	methods: {
		clickBtn() {
			var that = this;
			if (that.btnText == '拍照') {
				//获取相机对象
				let ctx = wx.createCameraContext(); //获取当前相机
				ctx.takePhoto({
					//拍照
					quality: 'high',
					success: function(resp) {
						console.log(resp.tempImagePath);
						that.photoPath = resp.tempImagePath;
						that.showCamera = false; //隐藏相机
						that.showImage = true; //展示照片
						that.btnText = '签到';
					}
				});
			}else{
				// 处理签到业务
				uni.getLocation({
					success: function(resp){
						console.log(resp.latitude)
						console.log(resp.longitude)
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: resp.latitude,
								longitude: resp.longitude
							},
							success: function(resp){
								let address = resp.result.address;
								console.log(address);
								let addressComponent = resp.result.address_component;
								console.log(addressComponent);
								let checkinForm = {
									address: address,
									country: addressComponent.nation,
									province: addressComponent.province,
									city: addressComponent.city,
									district: addressComponent.district
								}

								//图片上传
								uni.uploadFile({
									url: that.url.checkin,
									filePath: that.photoPath,
									name: 'photo',    // controller中的requestParam和这个name对应
									header:{
										"token": uni.getStorageSync('token')
									},
									formData: checkinForm,
									success: function(resp){
										if(resp.statusCode==500 && resp.data=='不存在人脸模型'){
											uni.showModal({
												title: '提示信息',
												content:'EMOS系统中不存在你的人脸模型，是否使用当前照片作为人脸模型?',
												success: function(resp){
													if(resp.confirm){
														uni.uploadFile({
															url: that.url.createFaceModel,
															filePath: that.photoPath,
															name: 'photo',
															header: {
																token: uni.getStorageSync('token')
															},
															success: function(resp){
																if(resp.statusc==500){
																	uni.showToast({
																		title: resp.data,
																		icon:'none'
																	})
																}else if(resp.statusCode==200){
																	// 面包屑提示框
																	uni.showToast({
																		title: '人脸建模成功',
																		icon:'none'
																	})
																}
															}
														})
													}
												}
											})
										}else if(resp.statusCode==200){
											uni.showToast({
												title: '签到成功',
												icon:'none'
											})
										}
									}
								})
							}
						})
					}
				})

			}
		},
		afresh(){
			this.showCamera= true;
			this.showImage = false;
			this.btnText = '拍照';
		}

	}
};
</script>

<style lang="less">
@import url('checkin.less');
</style>
