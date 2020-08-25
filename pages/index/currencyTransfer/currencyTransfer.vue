<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.currencyTransfer">
			<image slot="rightBox" src="~@/static/index/icon11.png" class="icon11" @tap="goTo('../transferRecord/transferRecord')"></image>
		</tab-top>
		<view class="content">
			<!-- 可用 -->
			<view class="desFlex">
				<view>
					<text class="txt1">{{languageInfo.available}}USDT</text>
					<text class="txt2">{{usdtBalance}}</text>
				</view>
				<view>
					<text class="txt1">{{languageInfo.available}}WiFi</text>
					<text class="txt2">{{wifiBalance}}</text>
				</view>
			</view>
			<!-- 转账类型 -->
			<view>
				<text class="txtItem">{{languageInfo.transferType}}</text>
			</view>
			<view class="mt30 types">
				<picker @change="translateType" :value="index" :range="transType" mode="selector" style="width: 100%;">
					<!-- <text class="telArea">+{{telCode}}</text> -->
					<input class="inp" type="text" v-model="types" :placeholder="languageInfo.pleaseChoose" disabled>
					<text class="iconSelect"></text>
				</picker>
			</view>
			<!-- 数量 -->
			<view class="mt50">
				<text class="txtItem">{{languageInfo.transfersNum}}</text>
			</view>
			<view class="mt30">
				<input class="inp" v-model="num" type="number" :placeholder="languageInfo.placeTransferNum">
			</view>
			<view class="tipBox">
				<text class="tips" v-show="num=='0'">{{languageInfo.auantityCant}}</text>
				<text class="tips" v-show="parseFloat(num)>parseFloat(usdtBalance) && types=='USDT'">{{languageInfo.numberThan}}USDT</text>
				<text class="tips" v-show="parseFloat(num)>parseFloat(wifiBalance) && types=='WiFi'">{{languageInfo.numberThan}}WiFi</text>
			</view>
			<!-- 地址 -->
			<view>
				<text class="txtItem">{{languageInfo.receivingAddress}}</text>
			</view>
			<view class="mt30 pasteBox">
				<input class="inps" v-model="address" type="text" :placeholder="languageInfo.placeAddress">
				<!-- <text class="pasteTxt">黏贴</text> -->
				<image class="pasteTxt" src="~@/static/index/scan.png" @tap="getCode"></image>
			</view>
			<!-- 手续费 -->
			<view class="mt50 feeBox">
				<image src="~@/static/index/icon12.png" class="icon12"></image>
				<text class="feeTxt">{{languageInfo.handlingFee}}：</text>
				<text class="fee">{{service*100}}%</text>
			</view>
			<!-- 按钮 -->
			<view>
				<text class="btn subBtn"  @tap="subTrans">{{languageInfo.confirmTransfer}}</text>
			</view>
		</view>
		<!-- 确认弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{languageInfo.confirmTransfer}}</text>
					</view>
					<view class="txt1">
						<text>{{languageInfo.transfersNum}}</text>
					</view>
					<view class="item">
						<text class="txt2">{{num}}</text>
						<text class="txt3">{{types}}</text>
					</view>
					<view class="tipBox">
						<image src="~@/static/index/icon13.png" class="icon13"></image>
						<view class="tipRight">
							<text class="serviceTxt">{{languageInfo.handlingFee}}:</text>
							<text class="serviceTxt">{{service*100}}%</text>
							<text class="serviceTxt">({{languageInfo.actuallyArrived}}：</text>
							<text class="serviceTxt">{{arrivedNum}} {{types}})</text>
						</view>
					</view>
					<view>
						<input class="inp" type="password" v-model="payPwd" :placeholder="languageInfo.placePayPwd">
					</view>
					<view>
						<button class="btns" @tap="verifyPwd" hover-class="none">{{languageInfo.confirm}}</button>
					</view>
					<view class="mb52">
						<button class="btns" hover-class="none" @tap="closeModal">{{languageInfo.cancel}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 提示弹窗 -->
		<!-- 	<view class="noYetTip" v-show="msgModal">
			{{msg}}
		</view> -->
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	var _this;
	export default {
		data() {
			return {
				usdtBalance: '0', //USDT余额
				wifiBalance: '0', //WIFI余额
				transType: ['USDT', 'WiFi'], //转账类型
				types: '', //转账类型选择
				num: '', //转账数量
				address: '', //转账地址
				myAddress: '', //我的转账地址
				typesId: '', //类型ID
				index: 0,
				payPwd: '', //支付密码
				service: '0', //手续费
				arrivedNum: '', //实际到账
				languageInfo: {},
				minNum: false //数量不能为0
			}
		},
		components: {
			tabTop,
			uniPopup
		},
		onLoad() {
			_this = this
			_this.usdtBalance = uni.getStorageSync('usdt')
			_this.wifiBalance = uni.getStorageSync('wifi')
		},
		onShow() {
			_this.getInfo()
			_this.languageInfo = _this.linkTo.showLanguage();
		},
		methods: {
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url)
			},
			getInfo() {
				_this.get('api/userInfo').then(res => {
					_this.myAddress = res.data.res.eth_address

				})
			},
			// 选择转账类型
			translateType: function(e) {
				_this.num = ''
				_this.index = e.detail.value
				let index = e.detail.value
				_this.types = _this.transType[index]
				if (_this.types == 'USDT') {
					_this.typesId = '2'
				} else if (_this.types == 'WiFi') {
					_this.typesId = '1'
				}
				let typesId = _this.typesId
				_this.get('api/getServiceCharge', {
					currency_id: typesId
				}).then(res => {
					_this.service = res.data.res.transfer_fee
				})
			},
			// 确认转账提交
			subTrans() {
				let types = _this.types
				let num = _this.num
				let address = _this.address
				let servece = _this.service
				let arrivedNum = parseFloat(num) - parseFloat((parseFloat(num) * parseFloat(servece)).toFixed(4))
				_this.arrivedNum = arrivedNum
				if (types == '' || num == '' || address == '') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
					// return
				} else if (address === _this.myAddress) {
					_this.linkTo.$noToast(_this.languageInfo.myselfTransfer)
					_this.address = ''
					// _this.addressShow = false
				} else if (num == '0') {
					_this.minNum = true
				} else if ((parseFloat(num) <= parseFloat(_this.usdtBalance) && types == 'USDT') || (parseFloat(num) <= parseFloat(
						_this.wifiBalance) && types == 'WiFi')) {
					this.$refs.popup.open()
				}
			},
			// 关闭弹窗
			closeModal() {
				_this.$refs.popup.close()
				_this.payPwd = ''
			},
			// 扫码
			getCode() {
				uni.scanCode({
					success: function(res) {
						_this.address = res.result
					}
				});
			},
			// 币币转账密码验证
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
			// 确认转账
			submitFetch() {
				let data = {
					num: _this.num,
					address: _this.address,
					currency_id: _this.typesId
				}
				_this.post('api/transfer', data).then(res => {
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
	.mt30 {
		margin-top: 30rpx;
	}

	.mt50 {
		margin-top: 50rpx;
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
		padding: 60rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;

		.tipBox {
			height: 50rpx;
		}

		.subBtn {
			display: inline-block;
			text-align: center;
		}

		.types {
			position: relative;

			.iconSelect {
				border-left: 12rpx solid transparent;
				border-right: 12rpx solid transparent;
				border-top: 18rpx solid #3CF8FF;
				position: absolute;
				right: 30rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.pasteBox {
			position: relative;
			@include borCol();
			border-radius: 6rpx;
			height: 80rpx;
			line-height: 80rpx;

			.inps {
				@include font26();
				@include mainCol();
				height: 80rpx;
				padding: 0 90rpx 0 30rpx;

			}

			.pasteTxt {
				@include font24();
				@include mainCol();
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				right: 30rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.desFlex {
			@include flexBet();
			padding-bottom: 100rpx;
			box-sizing: border-box;

			.txt1 {
				display: block;
				@include font30();
				@include colF();
				padding-bottom: 38rpx;
				box-sizing: border-box;
			}

			.txt2 {
				@include mainCol();
				@include font44();
			}
		}

		.feeBox {
			display: flex;
			align-items: center;
			.icon12 {
				width: 30rpx;
				height: 30rpx;
				margin-right: 8rpx;
			}

			.feeTxt {
				@include font22();
				@include mainCol();
			}

			.fee {
				@include font22();
				@include colF();
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
		left: 100rpx;
		right: 100rpx;
		transform: translateY(-50%);
		padding-bottom: 50rpx;
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
			margin-bottom: 54rpx;
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

		.serviceTxt {
			display: inline-block;
			@include font24();
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

			.tipRight {
				line-height: 30rpx;
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
			@include font20();
			@include colF();
			margin: 10rpx 40rpx 20rpx 40rpx;
			border-radius: 4rpx;
		}

	}
</style>
