<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.WiFiAddress"></tab-top>
		<view class="content">
			<view class="addressTxt">{{languageInfo.mywifiAddress}}</view>
			<view class="hr"></view>
			<!-- 二维码 -->
			<view class="imgBox">
				<image class="codeImg" :src="imgs"></image>
			</view>
			<!-- 地址 -->
			<view class="codeTxt">
				<text>{{address}}</text>
			</view>
			<!-- 按钮 -->
			<view>
				<text class="copyBtn" @tap="copyAddress(address)">{{languageInfo.copyAddress}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	export default {
		data() {
			return {
				imgs:'',
				address:'',
				languageInfo:{}
			}
		},
		components: {
			tabTop
		},
		onShow(){
			this.languageInfo = this.linkTo.showLanguage();
			let token = uni.getStorageSync('token');
			this.getInfo()
			// this.imgs = 'http://8.129.172.166:7091/api/wifiAddress?token='+encodeURIComponent(token) //测试
			this.imgs = 'http://8.210.16.34/api/wifiAddress?token='+encodeURIComponent(token) //正式
		},
		methods: {
			// 用户信息
			getInfo(){
				let _this = this
				_this.get('api/userInfo').then(res=>{
					_this.address = res.data.res.eth_address

				})
			},
			// 复制
			copyAddress(value){
				uni.setClipboardData({
					data: value, // 要复制的文字
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								uni.showToast({
									icon:'success'
								});
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.containerBox{
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}
	.content {
		text-align: center;
		padding-top: 20%;
		box-sizing: border-box;
		.addressTxt {
			@include mainCol();
			font-size: 35rpx;
			padding-top: 28rpx;
		}
		.hr{
			margin: 38rpx 124rpx 50rpx 124rpx;
			@include hr();
		}
		.imgBox{
			width: 100%;
		}
		.codeImg{
			width: 220rpx;
			height: 220rpx;
			margin: 0 auto;
		}
		.codeTxt{
			@include colF();
			@include font24();
			margin-top: 30rpx;
		}
		.copyBtn{
			@include font26();
			@include mainCol();
			@include borCol();
			display: inline-block;
			position: fixed;
			bottom: 154rpx;
			height: 64rpx;
			line-height: 64rpx;
			left: 124rpx;
			right: 124rpx;
			border-radius: 30rpx;
			
		}
	}
</style>
