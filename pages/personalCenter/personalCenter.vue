<template>
	<view class="content">
		<view class="headTop">
			<image class="logoIcon" src="~@/static/me/headIcon.png"></image>
			<text class="logoTxt ml20">5GWIFI</text>
		</view>
		<!-- 等级 -->
		<view class="levelBox">
			<view>
				<!-- <image src="~@/static/me/level1.png" class="levelIcon"></image> -->
				<image v-if="level=='0'" src="~@/static/me/level0.png" class="levelIcon"></image>
				<image v-if="level=='1'" src="~@/static/me/level1.png" class="levelIcon"></image>
				<image v-if="level=='2'" src="~@/static/me/level2.png" class="levelIcon"></image>
				<image v-if="level=='3'" src="~@/static/me/level3.png" class="levelIcon"></image>
				<image v-if="level=='4'" src="~@/static/me/level4.png" class="levelIcon"></image>
			</view>
			<view>
				<text class="idTxt">ID:{{uid}}</text>
				<text class="telTxt">{{languageInfo.registerMobile}}：{{phone}}</text>
			</view>
		</view>
		<!-- 列表 -->
		<view class="itemBox">
			<!-- 地址 -->
			<view class="items" @tap="goTo('wifiAddress/wifiAddress')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon1.png"></image>
					<text class="itemTxt">{{languageInfo.WiFiAddress}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<!-- 安全设置 -->
			<view class="items" @tap="goTo('securitySetting/securitySetting')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon2.png"></image>
					<text class="itemTxt">{{languageInfo.SecuritySettings}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<!-- 我的社区 -->
			<view class="items" @tap="goTo('myCommunity/myCommunity')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon3.png"></image>
					<text class="itemTxt">{{languageInfo.MyCommunity}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<!-- 消息中心 -->
			<view class="items" @tap="goTo('messageCenter/messageCenter')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon4.png"></image>
					<text class="itemTxt">{{languageInfo.messageCenter}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<!-- 系统公告 -->
			<view class="items" @tap="goTo('systemNotification/systemNotification')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon14.png"></image>
					<text class="itemTxt">{{languageInfo.systemNotification}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<!-- 客服中心 -->
			<view class="items" @tap="goTo('customerCenter/customerCenter')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon5.png"></image>
					<text class="itemTxt">{{languageInfo.CustomerService}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<!-- 切换账号 -->
			<view class="items" @tap="goTo('checkOut/checkOut')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon6.png"></image>
					<text class="itemTxt">{{languageInfo.switchAccount}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<!-- 切换语言 -->
			<picker @change="checkLanguage" :value="index" :range="languageData" mode="selector" style="width: 100%;">
				<view class="items">
					<view class="itemLeft">
						<image class="icon" src="~@/static/me/icon7.png"></image>
						<text class="itemTxt">{{languageInfo.switchLanguage}}</text>
					</view>
					<text class="nextIcon"></text>
				</view>
			</picker>
			<!-- 退出 -->
			<view class="items" @tap="outLogin">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon13.png"></image>
					<text class="itemTxt">{{languageInfo.signOut}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
		</view>
		<!-- 退出弹窗 -->
		<uni-popup ref='popup' type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{languageInfo.tips}}</text>
					</view>
					<view class="txt1">
						<text>{{languageInfo.outAccount}}</text>
					</view>
					<!-- 		<view class="item">
						<text class="txt2">3000</text>
						<text class="txt3">USDT</text>
					</view> -->
					<!-- 	<view>
						<input class="inp" type="password" v-model="payPwd" placeholder="请输入支付密码">
					</view> -->
					<view>
						<button class="btns" hover-class="none" @tap="closeModal">{{languageInfo.cancel}}</button>
					</view>
					<view class="mb52">
						<button class="btns" hover-class="none" @tap='submitModal'>{{languageInfo.confirm}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	var _this;
	export default {
		data() {
			return {
				phone: '', //手机号
				uid: '',
				languageData: ['中文简体', 'English', '한글', '日本語', 'ไทย', '中文繁體'],
				index: 0,
				level: '', //等级
				languageInfo: {} //切换语言
			}
		},
		components: {
			uniPopup
		},
		onLoad() {
			_this = this
		},
		onShow() {
			_this.languageInfo = this.linkTo.showLanguage();
			_this.checkLang();
			_this.getInfo()
			_this.getLevel()
		},
		methods: {
			// 导航语言切换
			checkLang() {
				uni.setTabBarItem({
					index: 0,
					text: _this.languageInfo.signalPoint
				});
				uni.setTabBarItem({
					index: 1,
					text: _this.languageInfo.globalBaseStation
				});
				uni.setTabBarItem({
					index: 2,
					text: _this.languageInfo.indexs
				});
				uni.setTabBarItem({
					index: 3,
					text: _this.languageInfo.marketPlace
				});
				uni.setTabBarItem({
					index: 4,
					text: _this.languageInfo.mine
				})
			},
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url);
			},
			// 社区等级信息
			getLevel() {
				_this.get('api/communityInfo').then(res => {
					if (res.data.code == 200) {
						_this.level = res.data.res.level
					}
				})
			},
			// 用户信息
			getInfo() {
				_this.get('api/userInfo').then(res => {
					_this.phone = res.data.res.phone
					_this.uid = res.data.res.uid
				})
			},
			// 切换语言
			checkLanguage(e) {
				let _this = this
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
				} else if (index == 4) {
					uni.setStorageSync('lang', 'th-th')
				} else if (index == 5) {
					uni.setStorageSync('lang', 'zh-tw')
				}
				_this.languageInfo = _this.linkTo.showLanguage();
				_this.checkLang()

			},
			// 退出
			outLogin() {
				_this.$refs.popup.open()
			},
			// 关闭弹窗
			closeModal() {
				_this.$refs.popup.close()
			},
			// 弹窗确认
			submitModal() {
				uni.removeStorageSync('token')
				uni.removeStorageSync('uid')
				uni.reLaunch({
					url: '../index/guidePages/guidePages'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ml20 {
		margin-left: 20rpx;
	}

	.mb52 {
		margin-bottom: 52rpx;
	}

	.content {
		@include bg();
		padding: 0 20rpx;
		height: 100%;

		.headTop {
			position: fixed;
			top: 0;
			width: 100%;
			height: calc(var(--status-bar-height) + 100rpx);
			padding-top: calc(var(--status-bar-height) + 50rpx);
			padding-left: 10rpx;
			padding-bottom: 40rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			z-index: 10;
			background: #0d1424;
		}

		.logoIcon {
			width: 40rpx;
			height: 40rpx;
		}

		.logoTxt {
			font-size: 35rpx;
			@include colF();
			font-weight: bold;
		}

		.levelBox {
			display: flex;
			align-items: center;
			background-image: url(~@/static/me/bg1.png);
			background-size: 100% 100%;
			height: 150rpx;
			padding: 36rpx 46rpx;
			box-sizing: border-box;

			.levelIcon {
				width: 72rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}

			.idTxt {
				font-size: 35rpx;
				@include mainCol();
				font-weight: bold;
				display: block;
			}

			.telTxt {
				@include colF();
				@include font24();
			}
		}

		// 列表
		.itemBox {
			margin: 44rpx 0;

			.items {
				@include flexBet();
				height: 100rpx;
				border: 2rpx solid #72ADFF;
				padding: 0 30rpx;
				box-sizing: border-box;
				border-radius: 6rpx;
				margin-bottom: 10rpx;

				.itemLeft {
					display: flex;
					align-items: center;
				}

				.icon {
					width: 44rpx;
					height: 44rpx;
				}

				.itemTxt {
					@include font24();
					@include colF();
					margin-left: 20rpx;
				}

			}
		}


	}

	// 弹窗
	.modalBox {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .7);
		z-index: 9;
	}

	.modalCon {
		@include borCol();
		border-radius: 10rpx;
		background: #021628;
		position: absolute;
		top: 50%;
		left: 140rpx;
		right: 140rpx;
		transform: translateY(-50%);
		z-index: 10;

		.title {
			@include font30();
			@include colF();
			height: 90rpx;
			line-height: 90rpx;
			background-color: #042848;
			text-align: center;
			border-top: 2rpx solid #3CF8FF;
			border-bottom: 2rpx solid #3CF8FF;
		}

		.txt1 {
			@include font28();
			@include colF();
			margin: 48rpx auto 38rpx auto;
			text-align: center;
		}

		.btns {
			height: 60rpx;
			line-height: 60rpx;
			@include borCol();
			@include font24();
			@include colF();
			margin: 20rpx 40rpx;
			border-radius: 4rpx;
		}

	}
</style>
