<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="'USDT'+languageInfo.recharge">
			<image slot="rightBox" class="icon11" src="~@/static/index/icon11.png" @tap="goTo('../rechargeRecord/rechargeRecord')"></image>
		</tab-top>
		<view class="content">
			<view class="titleTxt">ERC20{{languageInfo.internet}}</view>
			<view class="hr"></view>
			<view>
				<image class="codeImg" :src="imgs"></image>
			</view>
			<view>
				<text class="userId">{{address}}</text>
			</view>
			<view>
				<button class="copyBtn" hover-class="none" @tap="copyAddress(address)">{{languageInfo.copyAddress}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	var _this;
	export default {
		data() {
			return {
				imgs: '',
				address: '',
				languageInfo:{}
			}
		},
		components: {
			tabTop
		},
		onLoad() {
			_this = this
		},
		onShow() {
			_this.languageInfo = this.linkTo.showLanguage();
			let token = uni.getStorageSync('token')
			_this.getInfo()
			// _this.imgs = 'http://8.129.172.166:7091/api/rechargeQrCode?token=' + encodeURIComponent(token)
			_this.imgs = 'http://8.210.16.34/api/rechargeQrCode?token='+encodeURIComponent(token)
		},
		methods: {
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url)
			},
			// 用户信息
			getInfo() {
				let _this = this
				_this.get('api/userInfo').then(res => {
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
	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}

	.content {
		padding: 0 126rpx;
		text-align: center;
		box-sizing: border-box;
		margin-top: 20%;

		.titleTxt {
			@include mainCol();
			font-size: 35rpx;
			padding-top: 36rpx;
		}

		.hr {
			@include hr();
			margin-top: 38rpx;
		}

		.codeImg {
			width: 220rpx;
			height: 220rpx;
			background: #fff;
			margin-top: 50rpx;
		}

		.userId {
			display: inline-block;
			@include colF();
			@include font24();
			margin-top: 30rpx;
		}

		.copyBtn {
			@include font26();
			@include mainCol();
			@include borCol();
			border-radius: 30rpx;
			position: fixed;
			bottom: 154rpx;
			left: 126rpx;
			right: 126rpx;
		}
	}

	.icon11 {
		width: 44rpx;
		height: 48rpx;
	}
</style>
