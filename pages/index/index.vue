<template>
	<view class="page">
		<!-- 轮播图区域 -->
		<swiper circular="true" duration="1000" interval="5000" class="swiper">
			<swiper-item><image mode="widthFix" src="https://swiper-1302895443.cos.ap-shanghai.myqcloud.com/swiper-1.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://swiper-1302895443.cos.ap-shanghai.myqcloud.com/swiper-2.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://swiper-1302895443.cos.ap-shanghai.myqcloud.com/swiper-3.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://swiper-1302895443.cos.ap-shanghai.myqcloud.com/swiper-4.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://swiper-1302895443.cos.ap-shanghai.myqcloud.com/swiper-5.jpg"></image></swiper-item>
		</swiper>
		
		<!-- 消息区域 -->
		<view class="notify-container" @tap="toPage('消息提醒', '/pages/message_list/message_list')">
			<view class="notify-title">
				<image src="../../static/icon-1.png" mode="widthFix" class="notify-icon"></image>
				消息提醒
			</view>
			<view class="notify-content">你有{{unreadRows}}条未读消息</view>
			<image src="../../static/icon-2.png" mode="widthFix" class="more-icon"></image>
		</view>
		
		<!-- 栏目导航区域 -->
		<view class="nav-container">
			<view class="nav-row">
				<view class="nav" @tap="toPage('在线签到','../checkin/checkin')">
					<image mode="widthFix" src="../../static/nav-1.png" class="icon"></image>
					<text class="name">在线签到</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-2.png" class="icon"></image>
					<text class="name">员工健康</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-3.png" class="icon"></image>
					<text class="name">在线请假</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-4.png" class="icon"></image>
					<text class="name">公务出差</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-5.png" class="icon"></image>
					<text class="name">员工日报</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-6.png" class="icon"></image>
					<text class="name">我的加班</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-7.png" class="icon"></image>
					<text class="name">付款申请</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-8.png" class="icon"></image>
					<text class="name">费用报销</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-9.png" class="icon"></image>
					<text class="name">公告通知</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-10.png" class="icon"></image>
					<text class="name">在线审批</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-11.png" class="icon"></image>
					<text class="name">物品领用</text>
				</view>
				<view class="nav">
					<image mode="widthFix" src="../../static/nav-12.png" class="icon"></image>
					<text class="name">采购申请</text>
				</view>
			</view>
		</view>
		<uni-popup ref="popupMsg" type="top">
			<uni-popup-message type="success" :message="'接收到' + lastRows + '条消息'" :duration="2000"/>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},
	data() {
		return {
			timer: null,
			unreadRows: 0,
			lastRows: 0
		};
	},
	onLoad:function() {
		// 监听事件
		let that = this;
		uni.$on('showMessage', function() {
			that.$refs.popupMsg.open();
		});
	},
	onUnload:function() {
		// 移除监听事件
		uni.$off('showMessage');
	},
	onShow: function() {
		let that = this;
		that.timer = setInterval(function() {
			that.ajax(that.url.refreshMessage, 'GET', null, function(resp) {
				that.unreadRows = resp.data.unreadRows;
				that.lastRows = resp.data.lastRows;
				if (that.lastRows > 0) {
					uni.$emit('showMessage');
				}
			});
		}, 5 * 1000);
	},
	onHide:function() {
		clearInterval(this.timer);
	},
	methods: {
		toPage(name, url) {
			console.log(12312313);
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="less">
@import url('index.less');
</style>
