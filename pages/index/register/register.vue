<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.welcomeRegister"></tab-top>
		<!-- 手机号 -->
		<view class="content">
			<view>
				<text class="txtItem">{{languageInfo.placeYourPhoneNumber}}</text>
			</view>
			<view class="mt30 phoneTxt">
				<picker @change="translate" :value="index" :range="telItem" mode="selector" style="width: 100%;">
					<!-- <image class="pixImg" :src="pixImg"></image> -->
					<text class="telArea">{{telCode}}</text>
				</picker>
				<input class="inp inpFir" type="number" v-model="phone" :placeholder="languageInfo.placeYourPhoneNumber" placeholder-class="placeStyle">
			</view>
			<!-- <text class="pwdTip" v-show="phoneValid">手机号格式不正确</text> -->
			<!-- 验证码 -->
			<view class="mt20 code">
				<input type="number" v-model="phoneCode" class="inp inCode" :placeholder="languageInfo.phoneVerificationCode" placeholder-class="placeStyle">
				<view>
					<button v-if="codeDown" class="codeBtn" @tap="getCode">{{languageInfo.ClickToGet}}</button>
					<text class="codeBtn codeTxt" v-else>{{count}}</text>
				</view>
			</view>
			<!-- 登录密码 -->
			<view class="mt60">
				<text class="txtItem">{{languageInfo.yourPwd}}</text>
			</view>
			<view class="mt30">
				<input class="inp" @input="changeLogoPwd" v-model="loginPwd" type="password" :placeholder="languageInfo.yourPwd"
				 placeholder-class="placeStyle">
			</view>
			<view class="mt20">
				<input class="inp" v-model="confirLoginPwd" type="password" :placeholder="languageInfo.confirmPwd" placeholder-class="placeStyle">
			</view>
			<view class="pwdValidBox">
				<text class="pwdTip" v-show="confirLoginPwd!=''&&loginPwd!=confirLoginPwd">{{languageInfo.twoPwdInconsistent}}</text>
				<view class="pwdTip mt6" v-show="logoPwdValid">{{languageInfo.formatPwd}}</view>
			</view>
			<!-- 支付密码 -->
			<view>
				<text class="txtItem">{{languageInfo.placePayPwd}}</text>
			</view>
			<view class="mt30">
				<input class="inp" v-model="payPwd" type="password" :placeholder="languageInfo.placePayPwd" placeholder-class="placeStyle">
			</view>
			<view class="mt20">
				<input class="inp" type="password" v-model="confirPayPwd" :placeholder="languageInfo.confirmPayPwd" placeholder-class="placeStyle">
			</view>
			<view class="pwdValidBox">
				<text class="pwdTip" v-show="confirPayPwd!=''&&payPwd!=confirPayPwd">{{languageInfo.twoPwdInconsistent}}</text>
			</view>
			<!-- 邀请码 -->
			<view>
				<text class="txtItem">{{languageInfo.invitedUid}}</text>
			</view>
			<view class="mt30">
				<input class="inp" v-model="uids" type="text" :placeholder="languageInfo.invitedUid" placeholder-class="placeStyle">
			</view>
			<!-- 注册按钮 -->
			<view class="btnBox">
				<button class="regBtn" hover-class="none" @tap="regConfirm">{{languageInfo.regWallet}}</button>
			</view>
		</view>
		<!-- 弹窗UID -->
		<uni-popup ref="popup" type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{languageInfo.tips}}</text>
					</view>
					<view class="txt1">{{languageInfo.rememberUserName}}</view>
					<view class="txt1">
						<text class="uids">{{userIds}}</text>
					</view>
					<view>
						<button class="btns" @tap="copyUid(userIds)">{{languageInfo.copy}}</button>
					</view>
					<view class="mb52">
						<button class="btns" @tap="closeModal">{{languageInfo.cancel}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	var _this;
	export default {
		data() {
			return {
				pixImg:'',
				telItem: [],
				prefixData: [],
				en: '',
				userIds: '', //用户uid
				phoneValid: false, //手机号格式判断
				logoPwdValid: false, //登录密码格式判断
				msgModal: false, //提示框
				index: 0,
				telCode: "", //手机区号
				phone: '', //绑定的手机号
				phoneCode: '', //验证码
				loginPwd: '', //登录密码
				confirLoginPwd: '', //确认登录密码
				payPwd: '', //支付密码
				confirPayPwd: '', //确认支付密码
				uids: '', //邀请码
				timer: null, //倒计时
				count: 0, //按钮
				languageInfo:{},
				codeDown:true //验证码按钮
			}
		},
		components: {
			tabTop,
			uniPopup
		},
		onLoad() {
			_this = this
			_this.getPreFix()
		},
		onShow() {
			_this.languageInfo = this.linkTo.showLanguage()
		},
		methods: {
			// 手机号前缀
			getPreFix() {
				_this.get('api/phoneNumberPrefix').then(res => {
					if (res.data.code == 200) {
						_this.prefixData = res.data.res
						let items = _this.telItem
						let datas = res.data.res
						for (let i in datas) {
							items.push(datas[i].prefix)
						}
						_this.telCode = _this.telItem[0]
					}
				})
			},
			// 选择电话区号
			translate: function(e) {
				_this.index = e.detail.value
				let index = e.detail.value
				_this.telCode = _this.telItems[index]
				_this.en = _this.prefixData[index].en
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
			// 登录密码验证
			changeLogoPwd() {
				let logPwd = _this.loginPwd
				const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
				if (reg.test(logPwd)) {
					_this.logoPwdValid = false
				} else {
					_this.logoPwdValid = true
				}
			},
			// 弹窗取消
			closeModal() {
				_this.$refs.popup.close();
				uni.navigateTo({
					url: '../login/login'
				})
			},
			// 获取验证码
			getCode() {
				if (this.phone == '') {
					this.linkTo.$noToast(_this.languageInfo.enterPhoneNumber)
					return
				} else {
					// 判断手机号验证
					const TIME_COUNT = 120 
					let data = {
						prefix:_this.telCode,
						phone: _this.phone
					}
					_this.post('api/sms', data).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								icon: 'success'
							})
							if (!_this.timer) {
								_this.count = TIME_COUNT;
								_this.codeDown = true
								_this.timer = setInterval(() => {
									if (_this.count > 0 && _this.count <= TIME_COUNT) {
										_this.count--;
										_this.codeDown = false
									} else {
										clearInterval(_this.timer); // 清除定时器
										_this.timer = null;
										_this.codeDown = true
									}
								}, 1000)
							}
						} else {
							uni.showToast({
								title: res.data.message
							})
						}
					})
				}
			},
			// 注册提交
			regConfirm() {
				let tel = _this.phone
				let code = _this.phoneCode
				let logPwd = _this.loginPwd
				let logPwd2 = _this.confirLoginPwd
				let payPwd = _this.payPwd
				let payPwd2 = _this.confirPayPwd
				let uids = _this.uids
				let telCode = _this.telCode
				let index = _this.index
				let en = _this.prefixData[index].en
				let data = {
					prefix: telCode,
					phone: tel,
					code: parseInt(code),
					password: logPwd,
					confirm_password: logPwd2,
					re_password: payPwd,
					confirm_re_password: payPwd2,
					invite_uid: uids,
					en: en
				}
				if (tel == '' || code == '' || logPwd == '' || logPwd2 == '' || payPwd == '' || payPwd2 == '' || uids == '') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
					return
				} else {
					_this.post('api/register', data).then(res => {
						if (res.data.code == 200) {
							_this.userIds = res.data.res.uid
							_this.$refs.popup.open();
						} else {
							_this.linkTo.$noToast(res.data.message)
						}
					})
				}
			},
			// 复制uid
			copyUid(value) {
				uni.setClipboardData({
					data: value, // 要复制的文字
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								uni.showToast({
									icon: 'success'
								});
								_this.$refs.popup.close();
								_this.linkTo.navTo('../login/login')
							}
						});
					}
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mt60 {
		margin-top: 60rpx;
	}

	.mt30 {
		margin-top: 30rpx;
	}

	.mt20 {
		margin-top: 20rpx;
	}

	.mt6 {
		margin-top: 6rpx;
	}

	.mb52 {
		margin-bottom: 52rpx;
	}

	.containerBox {
		@include bg();
		box-sizing: border-box;
		height: 100%;
	}

	.content {
		$col: #3CF8FF;
		padding: 0rpx 30rpx 70rpx 30rpx;
		.pixImg{
			width: 40rpx;
			height: 40rpx;
		}
		.phoneTxt {
			position: relative;
		}

		.pwdTip {
			@include font20();
			color: red;
		}

		.pwdValidBox {
			height: 60rpx;
		}

		.telArea {
			@include font26();
			position: absolute;
			left: 30rpx;
			color: $col;
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
			border-top: 18rpx solid $col;
			position: absolute;
			left: 64rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		.inCode {
			width: 60%;
		}

		.inpFir {
			padding-left: 136rpx;
		}

		.placeStyle {
			color: #999;
			@include font24();
		}

		.code {
			@include flexBet();
		}

		.codeBtn {
			// width: 160rpx;
			height: 80rpx;
			line-height: 80rpx;
			padding:0 28rpx;
			@include borRadius();
			@include mainCol();
			@include font24();
			@include borCol();
			background: none;
		}
		.codeTxt{
			width: 100rpx;
			display: inline-block;
			text-align: center;
		}

		.btnBox {
			margin-top: 60rpx;

			.regBtn {
				color: $col;
				@include font26();
				background: none;
				border-radius: 30rpx;
				border: 2rpx solid $col;
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
		left: 154rpx;
		right: 154rpx;
		transform: translateY(-50%);
		z-index: 10;

		.title {
			@include font28();
			@include colF();
			height: 90rpx;
			line-height: 90rpx;
			background-color: #042848;
			text-align: center;
			border-top: 2rpx solid #3CF8FF;
			border-bottom: 2rpx solid #3CF8FF;
		}

		.txt1 {
			@include font24();
			@include colF();
			margin: 30rpx auto 38rpx auto;
			text-align: center;
		}

		.btns {
			height: 50rpx;
			line-height: 50rpx;
			@include borCol();
			@include font20();
			@include colF();
			margin: 10rpx 40rpx;
			border-radius: 4rpx;
		}

		.uids {
			display: inline-block;
			@include font34();
			@include mainCol();
			font-weight: bold;
		}

	}
</style>
