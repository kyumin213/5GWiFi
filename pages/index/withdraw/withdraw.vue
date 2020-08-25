<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="'USDT'+languageInfo.withdraw">
			<image slot="rightBox" class="icon11" src="~@/static/index/icon11.png" @tap="goTo('../withdrawalRecord/withdrawalRecord')"></image>
		</tab-top>
		<view class="content">
			<view class="txt1">
				<text>{{languageInfo.available}}USDT</text>
			</view>
			<view class="txt2">
				<text>{{usdt}}</text>
			</view>
			<!-- 提币数量 -->
			<view class="mt100">
				<text class="txtItem">{{languageInfo.withdrawalsNum}}</text>
			</view>
			<view class="mt30">
				<input class="inp" @input="changeNum" v-model="num" type="number" :placeholder="languageInfo.placeWithdrawalsNum"
				 placeholder-class="placeStyle">
			</view>
			<view class="validBox">
				<text class="tips" v-show="minNumShow">{{languageInfo.minimumAmount}}100</text>
				<text class="tips" v-show="parseFloat(num) > parseFloat(everydayQuota) || parseFloat(num)>parseFloat(usdt)">{{languageInfo.quantityExceeded}}</text>
			</view>
			<!-- 收款地址 -->
			<view>
				<text class="txtItem">{{languageInfo.receivingAddress}}</text>
			</view>
			<view class="mt30 addressBox">
				<input class="inp addInp" type="text" v-model="address" :placeholder="languageInfo.placeAddress" placeholder-class="placeStyle">
				<image src="~@/static/index/scan.png" class="scanIcon" @tap="getCode"></image>
			</view>
			<!-- 绑定手机号 -->
		<!-- 	<view>
				<text class="txtItem">{{languageInfo.bindPhone}}</text>
			</view> -->
			<view class="mt30 phoneTxt">
				<input type="text" v-model="phone" disabled="true" class="inp">
			</view>
			<!-- 验证码 -->
			<view class="mt30">
				<text class="txtItem">{{languageInfo.phoneVerificationCode}}</text>
			</view>
			<view class="mt30 code">
				<input class="inp inCode" v-model="phoneCode" type="text" :placeholder="languageInfo.phoneVerificationCode">
				<view>
					<button class="codeBtn" v-if="codedisabled" hover-class="none" @tap="getPhoneCode">{{languageInfo.ClickToGet}}</button>
					<text v-else class="codeBtn codeTxt">{{count}}</text>
				</view>
			</view>
			<!-- 提示 -->
			<view class="mt50 tipsIconBox">
				<image src="~@/static/index/icon12.png" class="tipIcon"></image>
				<text class="tipsTxt">{{languageInfo.prompt}}</text>
			</view>
			<view class="tipBox">
				<view>
					<text class="disblock">{{languageInfo.handlingFee}}：{{serviceChange}}% USDT</text>
					<text>{{languageInfo.minWithdrawal}}：{{minNum}} USDT</text>
				</view>
				<view>
					<text class="disblock">{{languageInfo.dailyLimit}}：{{maxNum}} USDT</text>
					<text>{{languageInfo.availableToday}}：{{everydayQuota}} USDT</text>
				</view>
			</view>
			<!-- 按钮 -->
			<view>
				<text class="subBtn mt50" hover-class="none" @tap="subWith">{{languageInfo.submitWithdrawal}}</text>
			</view>
		</view>
		<!-- 确认弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{languageInfo.submitWithdrawal}}</text>
					</view>
					<view class="txt1">
						<text class="txt1">{{languageInfo.withdrawalsNum}}</text>
					</view>
					<view class="item">
						<text class="txt2">{{num}}</text>
						<text class="txt3">USDT</text>
					</view>
					<view class="tipBox">
						<image src="~@/static/index/icon13.png" class="icon13"></image>
						<view>
							<text class="txtTip">{{languageInfo.handlingFee}}:</text>
							<text class="txtTip">{{serviceChange}}%</text>
							<text class="txtTip">({{languageInfo.actuallyArrived}}：</text>
							<text class="txtTip">{{arrivedNum}} USDT)</text>
						</view>
					</view>
					<view>
						<input class="inp" type="password" v-model="payPwd" :placeholder="languageInfo.placePayPwd">
					</view>
					<view>
						<button class="btns" hover-class="none" @tap="verifyPwd">{{languageInfo.confirm}}</button>
					</view>
					<view class="mb52">
						<button class="btns" hover-class="none" @tap="closeModal">{{languageInfo.cancel}}</button>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 提示弹窗 -->
		<view class="noYetTip" v-show="msgModal">
			{{languageInfo.informationEmpty}}
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	var _this;
	export default {
		data() {
			return {
				prefix: '', //手机前缀
				phone: '',//手机号显示
				phoneNum: '',//手机号参数
				phoneCode:'',//验证码
				minNumShow: false, //不能小于最低
				maxNumShow: false, //不能大于今日可提
				num: '', //提币数量
				address: '', //地址
				arrivedNum: '', //实际到账
				payPwd: '',
				msgModal: false,
				usdt: '0', //可用USDT
				serviceChange: '0', //手续费
				everydayQuota: '0', //今日可提
				minNum: '0', //最低提币
				maxNum: '0', //每日限额
				languageInfo: {},
				timer: null,
				count: 0,
				codedisabled: true, //验证码按钮状态
			}
		},
		components: {
			tabTop,
			uniPopup
		},
		onLoad() {
			_this = this
			_this.getInfo()
			let usdt = uni.getStorageSync('usdt')
			if (usdt) {
				_this.usdt = usdt
			}
		},
		onShow() {
			_this.languageInfo = this.linkTo.showLanguage();
			_this.getUserInfo()
		},
		methods: {
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url);
			},
			// 用户信息
			getUserInfo() {
				_this.get('api/userInfo').then(res => {
					_this.prefix = res.data.res.prefix
					let mobile = res.data.res.phone
					_this.phoneNum = mobile
					var reg = /^(\d{3})\d*(\d{4})$/;
					_this.phone = mobile.replace(reg,'$1****$2')
				})
			},
			// 获取验证码
			getPhoneCode() {
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
			// 提现信息
			getInfo() {
				_this.get('api/fetchInfo').then(res => {
					_this.serviceChange = res.data.res.service_charge * 100
					_this.everydayQuota = res.data.res.everyday_quota
					_this.minNum = res.data.res.min_num
					_this.maxNum = res.data.res.max_total_num
				})
			},
			// 提币数量
			changeNum(e) {
				let nums = e.detail.value
				// let usdt = _this.usdt
				if (nums < 100 && nums != '') {
					_this.minNumShow = true
				} else {
					_this.minNumShow = false
				}
			},
			// 扫码
			getCode() {
				uni.scanCode({
					success: function(res) {
						_this.address = res.result
					}
				});
			},
			// 关闭弹窗
			closeModal() {
				_this.$refs.popup.close()
				_this.payPwd = ''
			},
			// 确认提币提交
			subWith() {
				let num = _this.num
				let address = _this.address
				let minNum = _this.minNumShow
				let code = _this.phoneCode
				let arrivedNum = num - ((num * _this.serviceChange) / 100)
				_this.arrivedNum = arrivedNum
				if (num == '' || address == '' || code=='') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
					return
				} else if (!minNum && (parseFloat(num) < parseFloat(_this.usdt) || parseFloat(num) < parseFloat(_this.everydayQuota))) {
					this.$refs.popup.open()
				}
			},
			// 确认提币密码验证
			verifyPwd() {
				let pwd = _this.payPwd
				_this.post('api/paymentPasswordVerify', {
					password: pwd
				}).then(res => {
					if (res.data.code == 200) {
						_this.submitFetch()
					}
				})
			},
			// 确认提币
			submitFetch() {
				let data = {
					num: _this.num,
					address: _this.address,
					phone:_this.phoneNum,
					code:_this.phoneCode
				}
				_this.post('api/fetch', data).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							icon: 'success'
						})
						setTimeout(() => {
							_this.closeModal()
							uni.reLaunch({
								url: '../index'
							})
						}, 1000)
					}
				})
			}
		}
	}
</script>
<style>
	/* 	page {
		background-image: url(~@/static/bg.png);
		background-size: 100% 100%;
	} */
</style>
<style lang="scss" scoped>
	.mt100 {
		margin-top: 100rpx;
	}

	.mt30 {
		margin-top: 30rpx;
	}

	.mt50 {
		margin-top: 50rpx;
	}

	.mb52 {
		margin-bottom: 52rpx;
	}

	.icon11 {
		width: 44rpx;
		height: 48rpx;
	}

	.containerBox {
		@include bg();
		height: 100%;
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

		.txt1 {
			@include colF();
			@include font30();
		}

		.txt2 {
			@include mainCol();
			@include font60();
			font-weight: bold;
			margin-top: 38rpx;
		}

		.addressBox {
			position: relative;

			.addInp {
				padding-right: 80rpx;
			}
		}

		.scanIcon {
			width: 30rpx;
			height: 30rpx;
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		.tipIcon {
			width: 30rpx;
			height: 30rpx;
		}

		.disblock {
			display: block;
			margin-bottom: 10rpx;
		}

		.tipBox {
			@include flexBet();
			@include colF();
			@include font24();
			margin-top: 20rpx;
		}

		.tipsIconBox {
			display: flex;
			align-items: center;
		}

		.tipsTxt {
			margin-left: 8rpx;
			@include mainCol();
			@include font24();
		}



		.subBtn {
			display: inline-block;
			text-align: center;
			@include borCol();
			@include mainCol();
			@include font24();
			border-radius: 30rpx;
			height: 64rpx;
			line-height: 64rpx;
			width: 100%;
			margin-bottom: 50rpx;
			// position: fixed;
			// bottom: 98rpx;
			// left: 30rpx;
			// right: 30rpx;
		}

		.validBox {
			height: 50rpx;
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
		left: 134rpx;
		right: 134rpx;
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
			margin: 48rpx auto 38rpx auto;
			text-align: center;
		}

		.item {
			text-align: center;
			margin-bottom: 50rpx;
		}

		.txt2 {
			@include mainCol();
			@include font44();
			font-weight: bold;
		}

		.txt3 {
			@include mainCol();
			@include font30();
			margin-left: 10rpx;
		}

		.tipBox {
			@include cen();
			@include font16();
			@include colF();

			.icon13 {
				width: 20rpx;
				height: 20rpx;
				margin-right: 8rpx;
			}

			.txtTip {
				display: inline-block;
				@include font24();
			}
		}

		.inp {
			@include font20();
			margin: 22rpx 40rpx;
			height: 50rpx;
			line-height: 50rpx;
			background-color: #0E1725;
			text-align: center;

		}

		.btns {
			height: 50rpx;
			line-height: 50rpx;
			@include borCol();
			@include font24();
			@include colF();
			margin: 10rpx 40rpx 20rpx 40rpx;
			border-radius: 4rpx;
		}

	}
</style>
