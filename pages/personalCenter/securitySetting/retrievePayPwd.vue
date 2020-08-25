<template>
	<view class="containerBox">
		<tab-top left-icon='back' :title="languageInfo.retrievePayPwd"></tab-top>
		<view class="content">
			<!-- 绑定手机号 -->
			<view>
				<text class="txtItem">{{languageInfo.bindPhone}}</text>
			</view>
			<view class="mt30">
				<input type="text" v-model="phone" disabled="true" class="inp" :placeholder="languageInfo.bindPhoneNumber">
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
			<!-- 新支付密码 -->
			<view class="mt48">
				<text class="txtItem">{{languageInfo.placePayNewPwd}}</text>
			</view>
			<view class="mt30">
				<input type="password" v-model="newPwd" class="inp" :placeholder="languageInfo.placePayNewPwd">
			</view>
			<!-- 确认新支付密码 -->
			<view class="mt48">
				<text class="txtItem">{{languageInfo.confirPayPwd}}</text>
			</view>
			<view class="mt30">
				<input type="password" v-model="confirPwd" class="inp" :placeholder="languageInfo.enterNewPayPwd">
			</view>
			<view class="pwdValidBox">
				<text class="pwdTip" v-show="newPwd!=confirPwd && confirPwd!=''">{{languageInfo.twoPwdInconsistent}}</text>
			</view>
			<!-- 按钮 -->
			<text class="btn subBtn" @tap="submitUpdate">{{languageInfo.confirChange}}</text>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	var _this;
	export default {
		data() {
			return {
				prefix: '',
				phoneValid: false,
				phoneNum:'',
				phone: '', //绑定的手机号
				phoneCode: '', //验证码
				newPwd: '', //新密码
				confirPwd: '', //确认新密码
				languageInfo: {}, //语言包
				timer: null,
				count: 0,
				codedisabled: true, //验证码按钮状态
			}
		},
		components: {
			tabTop
		},
		onLoad() {
			_this = this
		},
		onShow() {
			_this.getInfo()
			_this.languageInfo = this.linkTo.showLanguage();
		},
		methods: {
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
					prefix:_this.prefix,
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
							_this.timer = setInterval(() => {
								if (_this.count > 0 && _this.count <= TIME_COUNT) {
									_this.count--;
									_this.codedisabled = false
								} else {
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
			// 验证手机号
			changePhone() {
				let tel = _this.phone
				const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
				if (reg.test(tel)) {
					_this.phoneValid = false
				} else {
					_this.phoneValid = true
				}
			},
			// 确认修改
			submitUpdate() {
				let phone = _this.phoneNum
				let code = _this.phoneCode
				let newPwd1 = _this.newPwd
				let newPwd2 = _this.confirPwd
				let en = _this.en
				let data = {
					phone: phone,
					code: code,
					password: newPwd1,
					confirm_password: newPwd2,
					en:en
				}
				if (phone == '' || code == '' || newPwd1 == '' || newPwd2 == '') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
					return
				} else if (!_this.phoneValid && newPwd1 == newPwd2) {
					_this.post('api/forgetPaymentPassword', data).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								icon: 'success'
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 2
								})
							}, 1500)
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
	.mt30 {
		margin-top: 30rpx;
	}

	.mt48 {
		margin-top: 48rpx;
	}

	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}

	.content {

		padding: 0 30rpx 20rpx 30rpx;
		box-sizing: border-box;
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
		.codeTxt{
			display: inline-block;
			width: 100rpx;
			text-align: center;
		}

		.tipBox {
			height: 48rpx;
		}

		.pwdTip {
			@include font20();
			color: red;
		}
		.subBtn{
			text-align: center;
		}
	}
</style>
