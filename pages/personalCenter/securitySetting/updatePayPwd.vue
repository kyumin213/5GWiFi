<template>
	<view class="containerBox">
		<tab-top left-icon='back' :title="languageInfo.updatePayPwd"></tab-top>
		<view class="content">
			<!-- 绑定手机号 -->
			<view>
				<text class="txtItem">{{languageInfo.bindPhone}}</text>
			</view>
			<view class="mt30 phoneTxt">
				<input type="text" v-model="phone" disabled="" class="inp" :placeholder="languageInfo.bindPhoneNumber">
			</view>
			<!-- 验证码 -->
			<view class="mt30">
				<text class="txtItem">{{languageInfo.phoneVerificationCode}}</text>
			</view>
			<view class="mt30 code">
				<input class="inp inCode" v-model="phoneCode" type="text" :placeholder="languageInfo.phoneVerificationCode">
				<view>
					<button class="codeBtn" v-if="codedisabled" hover-class="none" @tap="getCode">{{languageInfo.ClickToGet}}</button>
					<text v-else class="codeBtn codeTxt">{{count}}</text>
				</view>
			</view>
			<!-- 旧密码 -->
			<view class="mt30">
				<text class="txtItem">{{languageInfo.placeOldPayPwd}}</text>
			</view>
			<view class="mt48">
				<input class="inp" v-model="oldPayPwd" type="password" :placeholder="languageInfo.placeOldPayPwd">
			</view>
			<!-- 新密码 -->
			<view class="mt30">
				<text class="txtItem">{{languageInfo.placePayNewPwd}}</text>
			</view>
			<view class="mt48">
				<input class="inp" v-model="newPayPwd" type="password" :placeholder="languageInfo.placePayNewPwd">
			</view>
			<!-- 确认密码 -->
			<view class="mt30">
				<text class="txtItem">{{languageInfo.confirPayPwd}}</text>
			</view>
			<view class="mt48">
				<input class="inp" v-model="confirmPayPwd" type="password" :placeholder="languageInfo.enterNewPayPwd">
			</view>
			<view class="pwdValidBox">
				<text class="pwdTip" v-show="newPayPwd!=confirmPayPwd && confirmPayPwd!=''">{{languageInfo.twoPwdInconsistent}}</text>
				<!-- <view class="pwdTip mt6" v-show="logoPwdValid">密码格式不正确</view> -->
			</view>
			<!-- 按钮 -->
			<view class="btnBox">
				<text class="subBtn" @tap="goTo('retrievePayPwd')">{{languageInfo.forgetPayPwd}}</text>
				<text class="subBtn" @tap="submitUpdate">{{languageInfo.confirChange}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	var _this;
	export default {
		data() {
			return {
				prefix:'',
				phoneValid: false,
				timer: null,
				count: 0,
				codedisabled: true, //验证码按钮状态
				phone: '',
				phoneNum:'',
				phoneCode: '',
				oldPayPwd: '', //旧支付密码
				newPayPwd: '', //新支付密码
				confirmPayPwd: '', //确认新支付密码
				languageInfo: {} //语言包
			}
		},
		components: {
			tabTop
		},
		onLoad() {
			_this = this
		},
		onShow() {
			_this.languageInfo = _this.linkTo.showLanguage();
			_this.getInfo()
		},
		methods: {
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url)
			},
			// 用户信息
			getInfo() {
				_this.get('api/userInfo').then(res => {
					_this.prefix = res.data.res.prefix
					let mobile = res.data.res.phone
					_this.phoneNum = mobile
					var reg = /^(\d{3})\d*(\d{4})$/;
					_this.phone = mobile.replace(reg,'$1****$2')
				})
			},
			// 获取验证码
			getCode() {
				let phone = _this.phoneNum
				let data = {
					prefix: _this.prefix,
					phone: phone
				}
				_this.post('api/sms', data).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							icon: 'success'
						})
						const TIME_COUNT = 119
						if (!_this.timer) {
							_this.count = TIME_COUNT;
							_this.codedisabled = false;
							// _this.codeSus = true
							_this.timer = setInterval(() => {
								if (_this.count > 0 && _this.count <= TIME_COUNT) {
									_this.count--;
									_this.codedisabled = false
								} else {
									// _this.show = true;
									_this.codedisabled = true
									clearInterval(_this.timer); // 清除定时器
									_this.timer = null;
								}
							}, 1000)
						}
					} else {
						_this.linkTo.$noToast(res.message)
					}
				})
			},
			// 确认修改
			submitUpdate() {
				let oldPwd = _this.oldPayPwd
				let newPwd = _this.newPayPwd
				let confirmPwd = _this.confirmPayPwd
				let phone = _this.phoneNum
				let code = _this.phoneCode
				let data = {
					type: 2,
					password: oldPwd,
					new_password: newPwd,
					confirm_password: confirmPwd,
					phone: phone,
					code: code
				}
				if (oldPwd == '' || newPwd == '' || confirmPwd == '' || phone == '' || code == '') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
				} else if (newPwd == confirmPwd) {
					_this.post('api/changePassword', data).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								icon: 'success'
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								}, 1500)
							})
						} else {
							_this.linkTo.$noToast(res.message)
						}
					})
				}
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

	.mt30 {
		margin-top: 30rpx;
	}

	.mt48 {
		margin-top: 48rpx;
	}

	.content {
		padding: 0 30rpx;
		box-sizing: border-box;

		.phoneTxt {
			position: relative;
		}

		.telArea {
			@include font26();
			@include mainCol();
			position: absolute;
			left: 30rpx;
			top: 50%;
			transform: translateY(-50%);
			margin-right: 20rpx;
		}

		.telArea:after {
			content: '';
			width: 0;
			height: 0;
			border-left: 12rpx solid transparent;
			border-right: 12rpx solid transparent;
			border-top: 18rpx solid #3CF8FF;
			position: absolute;
			left: 64rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		.inpFir {
			padding-left: 136rpx;
		}

		.code {
			@include flexBet();
		}

		.inCode {
			width: 60%;
		}

		.codeBtn {
			// width: 160rpx;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 28rpx;
			@include borRadius();
			@include mainCol();
			@include font24();
			@include borCol();
			background: none;
		}

		.codeTxt {
			display: inline-block;
			width: 100rpx;
			text-align: center;
		}

		.tipBox {
			height: 48rpx;
		}

		.btnBox {
			position: fixed;
			bottom: 98rpx;
			left: 30rpx;
			right: 30rpx;
		}

		.subBtn {
			display: block;
			@include borCol();
			@include font26();
			@include mainCol();
			height: 64rpx;
			line-height: 64rpx;
			border-radius: 30rpx;
			margin-bottom: 10rpx;
			text-align: center;
		}

		.pwdTip {
			@include font20();
			color: red;
		}
	}
</style>
