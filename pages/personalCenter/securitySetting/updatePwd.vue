<template>
	<view class="containerBox">
		<tab-top left-icon='back' :title="languageInfo.updatePwd"></tab-top>
		<view class="content">
			<!-- 绑定手机号 -->
			<view>
				<text class="txtItem">{{languageInfo.bindPhone}}</text>
			</view>
			<view class="mt30">
				<input type="text" v-model="phone" class="inp" disabled="true" :placeholder="languageInfo.bindPhoneNumber">
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
				<text class="txtItem">{{languageInfo.placeOldPwd}}</text>
			</view>
			<view class="mt48">
				<input class="inp" v-model="oldPwd" type="password" :placeholder="languageInfo.placeOldPwd">
			</view>
			<view class="pwdValidBox">
				<!-- <view class="pwdTip mt6" v-show="oldPwdValid">密码格式不正确</view> -->
			</view>
			<!-- 新密码 -->
			<view class="mt30">
				<text class="txtItem">{{languageInfo.placeNewPwd}}</text>
			</view>
			<view class="mt48">
				<input class="inp" v-model="newPwd" type="password" :placeholder="languageInfo.placeNewPwd">
			</view>
			<view class="pwdValidBox"></view>
			<!-- 确认密码 -->
			<view class="mt30">
				<text class="txtItem">{{languageInfo.placeConfirNewPwd}}</text>
			</view>
			<view class="mt48">
				<input class="inp" v-model="confirmNewPwd" type="password" :placeholder="languageInfo.enterNewPwd">
			</view>
			<view class="pwdValidBox">
				<text class="pwdTip mt6" v-show="newPwd!=confirmNewPwd && confirmNewPwd!=''">{{languageInfo.twoPwdInconsistent}}</text>
				<!-- <view class="pwdTip mt6" v-show="logoPwdValid">密码格式不正确</view> -->
			</view>
			<!-- 按钮 -->
			<view>
				<text class="btn subBtn"  @tap="submitUpdate">{{languageInfo.confirChange}}</text>
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
				phoneValid: false,
				prefix:'',
				timer: null,
				count: 0,
				codedisabled: true, //验证码按钮状态
				phoneNum:'',
				phone: '',
				phoneCode: '',
				oldPwd: '', //旧密码
				newPwd: '', //新密码
				oldPwdValid: false,
				logoPwdValid: false,
				confirmNewPwd: '', //确认新密码
				languageInfo: {} //语言包
			}
		},
		components: {
			tabTop
		},
		onLoad(){
			_this = this
		},
		onShow() {
			_this.languageInfo = this.linkTo.showLanguage();
			_this.getInfo()
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
			changeOldPwd() {
				let oldPwd = _this.oldPwd
				const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
				if (reg.test(oldPwd)) {
					_this.oldPwdValid = false
				} else {
					_this.oldPwdValid = true
				}
			},
			// 登录密码验证
			changeLogoPwd() {
				let logPwd = _this.newPwd
				const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
				if (reg.test(logPwd)) {
					_this.logoPwdValid = false
				} else {
					_this.logoPwdValid = true
				}
			},
			// 确认修改
			submitUpdate() {
				let data = {
					type: 1,
					password: _this.oldPwd,
					new_password: _this.newPwd,
					confirm_password: _this.confirmNewPwd,
					phone:_this.phoneNum,
					code:_this.phoneCode
				}
				if (_this.oldPwd == '' || _this.newPwd == '' || _this.newPwd2 == '' || _this.phone=='' ||_this.phoneCode=='') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
					// return
				} else if (_this.newPwd == _this.confirmNewPwd) {
					_this.post('api/changePassword', data).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								icon:'success'
							})
							setTimeout(() => {
								//清空本地用户信息
								uni.removeStorageSync('token');
								uni.reLaunch({
									url: '../../index/login/login'
								})
							}, 1500)

						} else {
							_this.linkTo.$noToast(res.data.message)
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

	.mt6 {
		margin-top: 6rpx;
	}
	.containerBox{
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}
	.content {
		padding: 0 30rpx;
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
		
		.codeTxt {
			display: inline-block;
			width: 100rpx;
			text-align: center;
		}
		
		.tipBox {
			height: 48rpx;
		}
		.subBtn {
			text-align: center;
			@include borCol();
			@include font26();
			@include mainCol();
			position: fixed;
			bottom: 98rpx;
			left: 30rpx;
			right: 30rpx;
			height: 64rpx;
			line-height: 64rpx;
			border-radius: 30rpx;

		}

		.pwdValidBox {
			height: 30rpx;
		}

		.pwdTip {
			@include font20();
			color: red;
		}
	}
</style>
