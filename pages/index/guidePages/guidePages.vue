<template>
	<view class="content">
		<view class="headTop">
			<view class="disFlex">
				<image class="icon" src="../../../static/index/logo.png"></image>
				<text class="iconTxt">5GWIFI</text>
			</view>
			<view>
				<view>
					<picker @change="checkLanguage" :value="index" :range="languageData" mode="selector" style="width: 100%;">
						<text class="checkBtn">{{languageInfo.switchLanguage}}</text>
					</picker>
				</view>
			</view>
		</view>
		<!-- 进入钱包、注册钱包 -->
		<view class="btnBox">
			<button class="logBtn" @tap="goTo('../login/login')">{{languageInfo.enterwallet}}</button>
			<button class="logBtn" @tap="goTo('../register/register')">{{languageInfo.regWallet}}</button>
		</view>
	</view>
</template>

<script>
	var _this;
	export default {
		data() {
			return {
				languageData: ['中文简体', 'English', '한글', '日本語','ไทย','中文繁體'],
				index: 0,
				languageType: '', //切换语言
				languageInfo: {}
			}
		},
		onLoad(){
			_this = this
		},
		onShow() {
			_this.languageInfo = _this.linkTo.showLanguage();
		},
		methods: {
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url);
			},
			// 进入钱包
			toIndex() {
				uni.switchTab({
					url: '../index'
				})
			},
			// 切换国家
			checkLanguage(e) {
				_this.index = e.detail.value
				let index = e.detail.value
				if (index == 0) {
					uni.setStorageSync('lang', 'zh-cn')
				} else if (index == 1) {
					uni.setStorageSync('lang', 'en-us')
				} else if (index == 2) {
					uni.setStorageSync('lang', 'ko-kr')
				} else if (index == 3) {
					uni.setStorageSync('lang', 'ja-jp')
				}else if(index == 4){
					uni.setStorageSync('lang', 'th-th')
				}else if(index == 5){
					uni.setStorageSync('lang', 'zh-tw')
				}
				_this.languageInfo = _this.linkTo.showLanguage();
			}
		}
	}
</script>
<style lang="scss" scoped>
	$col:#3CF8FF;

	.content {
		height: 100%;
		background: url('~@/static/login-bg.png') no-repeat center center;
		background-size: cover;
		.headTop {
			@include flexBet();
			position: fixed;
			top: 0;
			width: 100%;
			height: calc(var(--status-bar-height) + 100rpx);
			padding-top: calc(var(--status-bar-height) + 50rpx);
			padding-left: 30rpx;
			padding-bottom: 40rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			z-index: 10;
			background: #0d1424;
			padding: 0 30rpx;
			box-sizing: border-box;
		}

		.disFlex {
			display: flex;
			align-items: center;
		}

		.icon {
			width: 32rpx;
			height: 36rpx;
			margin-right: 20rpx;
		}

		.iconTxt {
			font-weight: bold;
			font-size: 35rpx;
			@include colF();
		}

		.checkBtn {
			display: inline-block;
			padding: 0 18rpx;

			height: 40rpx;
			line-height: 40rpx;
			border: 2rpx solid $col;
			@include mainCol();
			@include font24();
			border-radius: 20rpx;
		}

		// 按钮
		.btnBox {
			width: 100%;
			position: absolute;
			bottom: 33%;
			transform: translateY(33%);
			box-sizing: border-box;

			.logBtn {
				@include font26();
				@include mainCol();
				border: 2rpx solid $col;
				background: none;
				border-radius: 30rpx;
				height: 74rpx;
				line-height: 74rpx;
				margin: 40rpx 126rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
