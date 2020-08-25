<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.forgetPassword"></tab-top>
		<view class="content">
			<!-- 绑定手机号码 -->
			<view>
				<text class="txtItem">{{languageInfo.bindPhoneNumber}}</text>
			</view>
			<view class="mt30 phoneTxt">
				<picker @change="translate" :value="index" :range="telItem" mode="selector" style="width: 100%;">
					<text class="telArea">{{telCode}}</text>
				</picker>
				<input class="inp inpFir" v-model="phone" type="number" :placeholder="languageInfo.bindPhoneNumber"
				 placeholder-class="placeStyle">
			</view>
			<view style="height: 50rpx;">
				<!-- <text class="tips" v-show="telShow">手机号不能为空</text> -->
				<!-- <text class="tips" v-show="phoneValid">手机号格式不正确</text> -->
			</view>
			<view>
				<text class="txtItem">{{languageInfo.phoneVerificationCode}}</text>
			</view>
			<view class="mt30 code">
				<input type="number" v-model="phoneCode" class="inp codeIn" :placeholder="languageInfo.phoneVerificationCode" placeholder-class="placeStyle">
				<view>
					<button v-if="codeDown" class="codeBtn" hover-class="none"  @tap="getCode">{{languageInfo.ClickToGet}}</button>
					<text v-else class="codeBtn codeTxt">{{count}}</text>
				</view>
			</view>
			<!-- 用户ID -->
			<view class="mt50">
				<text class="txtItem">{{languageInfo.enterUserName}}</text>
			</view>
			<view class="mt30">
				<input class="inp" v-model="userId" type="text" :placeholder="languageInfo.enterUserName" placeholder-class="placeStyle">
			</view>
			<!-- 新密码 -->
			<view class="mt50">
				<text class="txtItem">{{languageInfo.placeNewPwd}}</text>
			</view>
			<view class="mt30">
				<input class="inp" v-model="newPwd" type="password" :placeholder="languageInfo.placeNewPwd" placeholder-class="placeStyle">
			</view>
			<!-- 确认密码 -->
			<view class="mt50">
				<text class="txtItem">{{languageInfo.placeConfirNewPwd}}</text>
			</view>
			<view class="mt30">
				<input class="inp" v-model="confirmPwd" type="password" :placeholder="languageInfo.placeConfirNewPwd" placeholder-class="placeStyle">
			</view>
			<view>
				<text class="tips" v-show="newPwd!=confirmPwd&&confirmPwd!=''">{{languageInfo.twoPwdInconsistent}}</text>
			</view>
			<!-- 按钮 -->
			<view>
				<button class="btn" hover-class="none" @tap="submitUpdate">{{languageInfo.confirChange}}</button>
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
				prefixData: [],
				telItem: [], //手机前缀
				telCode: '', //选中前缀
				index: 0,
				en:'CN',
				phoneValid: false,
				telShow: false, //手机为空
				phone: '', //绑定的手机号
				phoneCode: '', //验证码
				userId: '', //用户ID
				newPwd: '', //新密码
				confirmPwd: '', //确认新密码
				languageInfo: {}, //语言包
				timers: null, //倒计时
				count: 0,
				codeDown: true, //获取验证按钮状态
			}
		},
		components: {
			tabTop
		},
		onLoad() {
			_this = this
		},
		onShow() {
			this.languageInfo = this.linkTo.showLanguage();
			this.getPreFix()
		},
		methods: {
			// 手机号前缀
			getPreFix() {
				_this.get('api/phoneNumberPrefix').then(res => {
					_this.prefixData = res.data.res
					let items = _this.telItem
					let datas = res.data.res
					for (let i in datas) {
						items.push(datas[i].prefix)
					}
					_this.telCode = _this.telItem[0]
				})
			},
			// 选择电话区号
			translate: function(e) {
				_this.index = e.detail.value
				let index = e.detail.value
				_this.telCode = _this.telItem[index]
				_this.en = _this.prefixData[index].en
			},
			// 获取验证码
			getCode() {
				let phone = _this.phone
				let data = {
					prefix:_this.telCode,
					phone: phone
				}
				const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
				if (phone == '') {
					_this.linkTo.$noToast(_this.languageInfo.enterPhoneNumber)
				} 
				// else if (!reg.test(phone)) {
				// 	_this.phoneValid = true
				// }
				 else {
					_this.phoneValid = false
					_this.post('api/sms', data).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								icon: 'success'
							})
							const TIME_COUNT = 119
							if (!_this.timers) {
								_this.count = TIME_COUNT;
								_this.codeDown = true
								_this.timers = setInterval(() => {
									if (_this.count > 0 && _this.count <= TIME_COUNT) {
										_this.count--;
										_this.codeDown = false
									} else {
										_this.codeDown = true
										clearInterval(_this.timers); // 清除定时器
										_this.timers = null;
									}
								}, 1000)
							}
						} else {
							_this.linkTo.$noToast(res.message)
						}
					})

				}
			},
			// 验证手机号
			changePhone() {
				let tel = _this.phone
				let code = _this.telCode
				var phones={
					'CN':/^(\+?0?86\-?)?1[345789]\d{9}$/,
					'JA':/^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/,
					'MY':/^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/
				}
				let en = _this.en
				const reg = phones.CN
				let phone = code+tel
				// const reg =  /^(\+?0?86\-?)?1[345789]\d{9}$/
				// const regJp = /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/
				if (reg.test(tel)) {
					_this.phoneValid = false
				} else {
					_this.phoneValid = true
				}
			},
			// 确认修改
			submitUpdate() {
				let _this = this
				let phone = _this.phone
				let codes = _this.phoneCode
				let ids = _this.userId
				let pwd1 = _this.newPwd
				let pwd2 = _this.confirmPwd
				let en = _this.en
				let data = {
					phone: phone,
					code: codes,
					uid: ids,
					password: pwd1,
					confirm_password: pwd2,
					en:en
				}
				if (phone == '' || codes == '' || ids == '' || pwd1 == '' || pwd2 == '') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
				} else if (pwd1 == pwd2) {
					_this.post('api/forgetPassword', data).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								icon: 'success'
							})
							setTimeout(() => {
								uni.reLaunch({
									url: '../login/login'
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
	.mt50 {
		margin-top: 50rpx;
	}

	.mt30 {
		margin-top: 30rpx;
	}

	.mt20 {
		margin-top: 20rpx;
	}

	.containerBox {
		@include bg();
		height: 100%;
	}

	.content {
		padding: 0 30rpx 0 30rpx;

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

		.tips {
			@include font24();
			color: red;
		}

		.txtItem {
			width: 100%;
			@include colF();
			@include font30();
		}

		// .inp {
		// 	@include borRadius();
		// 	@include font26();
		// 	@include borCol();
		// 	@include mainCol();
		// 	height: 80rpx;
		// 	padding: 0 30rpx;
		// }

		.inpFir {
			padding-left: 136rpx;
		}

		.codeIn {
			width: 60%;
		}

		.placeStyle {
			color: #999;
			@include font24();
		}

		.code {
			@include flexBet();
		}

		.codeBtn {
			padding:0 28rpx;
			height: 80rpx;
			line-height: 80rpx;
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
	}
</style>
