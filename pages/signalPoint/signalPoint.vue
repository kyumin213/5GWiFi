<template>
	<view class="content">
		<!-- top -->
		<view class="headTop">
			<image class="logoIcon" src="../../static/signalPoint/signalPointLogo.png"></image>
			<text class="logoTxt ml20">{{language['signalPoint']}}</text>
		</view>
		<view class="videoBox">
			<image style="width: 100%;" src="../../static/signalPoint/signalVideo.gif" mode="widthFix"></image>
		</view>
		<view class="scrollBtn">
			<view class="conductMoneyTop">
				<image src="../../static/signalPoint/topBg.png" class="topBg"></image>
				<text>{{language['manageMoney']}}</text>
			</view>
			<view class="introduceBox">
				<view class="introduceItem">
					<image src="../../static/signalPoint/ji1.png"></image>
					<text>100{{language['start']}}</text>
				</view>
				<view class="introduceItem">
					<image src="../../static/signalPoint/ji2.png"></image>
					<text>{{language['contractPeriod']}} 10 {{language['day']}}</text>
				</view>
				<view class="introduceItem">
					<image src="../../static/signalPoint/ji3.png"></image>
					<text>{{language['revenuePerDay']}} 0.5%</text>
				</view>
			</view>
			<text class="buttomBtn" style="margin-top: 40rpx;" @tap="buyComfir">{{language['buyNow']}}</text>
			<text class="buttomBtn" style="margin-bottom: 40rpx;" @tap="goTo('interestRecord/interestRecord')">{{language['viewRecords']}}</text>
		</view>
		<!-- 弹窗-->
		<uni-popup ref="popup" type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{language['purchaseFinancing']}}</text>
					</view>
					<view class="txt1">
						<text>{{language['enterThePurchaseQuantity']}}</text>
					</view>
					<view>
						<input class="inp" type="number" v-model="buyNum" :placeholder="language['anIntegerMultipleof100']">
					</view>
					<view class="tipBox">
						<image src="~@/static/index/icon13.png" class="icon13"></image>
						<view>
							<view class="tipText">{{language['quantityAndmultiple']}}</view>
						</view>
					</view>
					<view>
						<input class="inp" type="password" v-model="payPwd" :placeholder="language['enterPayPwd']">
					</view>
					<view>
						<button class="btns" @tap="chekMarket">{{language['confirm']}}</button>
					</view>
					<view class="mb52">
						<button class="btns" @tap="closeModal">{{language['cancel']}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentLanguage: '',
				payPwd: '',
				buyNum: '',
				language:{}
			}
		},
		onShow() {
			this.language = this._lge[uni.getStorageSync('lang')]
			this.$forceUpdate()
			let language2 = uni.getStorageSync('lang')
			if (this.Language == '') {
				this.currentLanguage = language2
			} else if (this.currentLanguage != language2) {
				this.$forceUpdate()
				this.currentLanguage = language2
			}
		},
		mounted() {
		},
		methods: {
			chekMarket() {
				if (this.buyNum == '') {
					this.linkTo.$noToast(this._getLge('enterThePurchaseQuantity'))
					return
				}
				if (this.buyNum % 100 != 0) {
					this.linkTo.$noToast(this._getLge('quantityAndmultiple'))
					return
				}
				if (this.buyNum < 100) {
					this.linkTo.$noToast(this._getLge('quantityAndmultiple'))
					return
				}
				if (this.payPwd == '') {
					this.linkTo.$noToast(this._getLge('enterPayPwd'))
					return
				}
				// 验证支付密码
				this.post('api/paymentPasswordVerify', {
					password: this.payPwd
				}).then(res => {
					if (res.data.code == 200) {
						// 确认购买
						this.buyInterest()
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			buyInterest(){
				this.post('api/buyFund', {num:this.buyNum}).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: this._getLge('purchaseSuccessful'),
							type: 'success',
							duration: 1000
						});
						this.$refs.popup.close()
						this.payPwd = ''
						this.buyNum = ''
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			closeModal() {
				let _this = this
				_this.$refs.popup.close()
				this.payPwd = ''
				this.buyNum = ''
			},
			// 购买确认
			buyComfir() {
				let _this = this
				_this.$refs.popup.open();
			},
			goTo(path) {
				this.linkTo.navTo(path)
			}
		},
		components: {

		},
	}
</script>

<style scoped lang="scss">
	.ml20 {
		margin-left: 20rpx;
	}

	.mb0 {
		margin-bottom: 0 !important;
	}

	.fx {
		display: flex;
		flex-direction: row;
	}

	.content {
		background-color: #0c1524;
		@include bg();
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;

		.headTop {
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
		}
		.videoBox{
			margin-top: 30rpx;
			width: 100%;
		}
		.logoIcon {
			width: 32rpx;
			height: 36rpx;
		}

		.logoTxt {
			font-size: 35rpx;
			@include colF();
			font-weight: bold;
		}
		.conductMoneyTop {
			width: 100%;
			height: 234rpx;
			margin-right: 20rpx;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.topBg{
				width: 330rpx;
				height: 234rpx;
			}
			text {
				position: absolute;
				width: 100%;
				text-align: center;
				display: block;
				color: #3CF8FF;
				font-weight: bold;
				text-shadow: 2px 2px 2px #0A1525;
				font-size: 36rpx;
			}
		}

		.introduceBox {
			width: 100%;
			height: 170rpx;
			display: flex;
			justify-content: space-around;
			.introduceItem {
				width: 200rpx;
				height: 170rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;

				image {
					flex-shrink: 0;
					width: 76rpx;
					height: 82rpx;
				}

				text {
					color: #FFFFFF;
					font-size: 24rpx;
					margin-top: 20rpx;
				}
			}
		}

		.buttomBtn {
			display: block;
			width: 90%;
			padding: 20rpx 0;
			text-align: center;
			margin: 0 auto;
			color: #3CF8FF;
			font-size: 26rpx;
			border: 1px solid #3CF8FF;
			border-radius: 32rpx;
			margin-top: 10rpx;
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
	}

	.modalCon {
		@include borCol();
		border-radius: 10rpx;
		background: #021628;
		position: absolute;
		top: 50%;
		left: 104rpx;
		right: 104rpx;
		transform: translateY(-50%);
		z-index: 10;
		padding-bottom: 30rpx;

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
			margin: 38rpx auto 38rpx auto;
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
			@include font16();
			@include colF();
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 0 40rpx;

			.icon13 {
				width: 24rpx;
				height: 24rpx;
				margin-right: 8rpx;
			}

			.tipText {
				margin-bottom: 4rpx;
				display: block;
				width: 100%;
				text-align: left;
				font-size: 24rpx;
				flex: 1;
			}
		}

		.inp {
				@include font24();
				margin: 20rpx 40rpx;
				height: 60rpx;
				line-height: 54rpx;
				background-color: #0E1725;

		}

		.btns {
			height: 60rpx;
			line-height: 54rpx;
			@include borCol();
			@include font24();
			@include colF();
			margin: 20rpx 40rpx;
			border-radius: 4rpx;
		}

	}
</style>
