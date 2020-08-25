<template>
	<view class="content">
		<!-- logo -->
		<view class="headTop">
			<image class="logoIcon" src="~@/static/index/logo.png"></image>
			<text class="logoTxt ml20">5GWIFI</text>
		</view>
		<!-- 资产 -->
		<view class="assetxBox">
			<view class="assLeft">
				<text class="txtName mb18">USDT{{languageInfo.usdtAssets}}</text>
				<text class="monCol">{{usdtNum}}</text>
				<image class="border" src="~@/static/index/border.png"></image>
				<text class="fz24 downTxtCol mb18">{{usdtEarn}}</text>
				<text class="todayTxt">{{languageInfo.TodayEarnings}}</text>
			</view>
			<view class="assRight">
				<text class="txtName mb18">WiFi{{languageInfo.usdtAssets}}</text>
				<text class="monCol">{{wifiNum}}</text>
				<image class="border" src="~@/static/index/border.png"></image>
				<text class="fz24 upTxtCol mb18">{{wifiEarn}}</text>
				<text class="todayTxt">{{languageInfo.TodayEarnings}}</text>
			</view>
		</view>
		<!-- 待释放 -->
		<view class="freedBox" @tap="goTo('release/release')">
			<view>
				<view class="freedLeft">
					<image class="icon1" src='~@/static/index/icon1.png'></image>
					<text class="allNum">{{languageInfo.totalAmount}}</text>
				</view>
			</view>
			<view>
				<!-- <text class="allWifi">{{languageInfo.wifiFreed}}</text> -->
				<text class="allWifi">{{leaveNum}}</text>
			</view>
		</view>
		<!-- 充值 -->
		<view class="rechargeBox" @tap="goTo('recharge/recharge')">
			<image class="icon2" src="~@/static/index/icon2.png"></image>
			<text class="rechTxt">USDT{{languageInfo.recharge}}</text>
		</view>
		<!-- 轮播图 -->
		<view class="bannerBox">
			<swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" indicator-active-color="#3CF8FF"
			 indicator-color="#0D1522" duration="1500">
				<swiper-item v-for="(item,index) in bannerData" :key="index" v-if="lang=='zh-cn'">
					<image :src="item.img" class="itemImg"></image>
				</swiper-item>
				<swiper-item v-for="(item,index) in bannerData2" :key="index" v-if="lang=='zh-tw'">
					<image :src="item.img" class="itemImg"></image>
				</swiper-item>
				<swiper-item v-for="(item,index) in bannerData3" :key="index" v-if="lang=='ko-kr'">
					<image :src="item.img" class="itemImg"></image>
				</swiper-item>
				<swiper-item v-for="(item,index) in bannerData4" :key="index" v-if="lang=='ja-jp'">
					<image :src="item.img" class="itemImg"></image>
				</swiper-item>
				<swiper-item v-for="(item,index) in bannerData5" :key="index" v-if="lang=='th-th'">
					<image :src="item.img" class="itemImg"></image>
				</swiper-item>	
				<swiper-item v-for="(item,index) in bannerData6" :key="index" v-if="lang=='en-us'">
					<image :src="item.img" class="itemImg"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 底部图标 -->
		<view class="bomBox">
			<view class="items" @tap="goTo('inviteFriends/inviteFriends')">
				<image class="bomIcon" src="~@/static/index/icon3.png"></image>
				<text class="iconTxt">{{languageInfo.inviteFriends}}</text>
			</view>
			<view class="items" @tap="goTo('withdraw/withdraw')">
				<image class="bomIcon" src="~@/static/index/icon4.png"></image>
				<text class="iconTxt">USDT{{languageInfo.withdraw}}</text>
			</view>
			<view class="items" @tap="goTo('myBaseStation/myBaseStation')">
				<image class="bomIcon" src="~@/static/index/icon5.png"></image>
				<text class="iconTxt">{{languageInfo.myBaseStation}}</text>
			</view>
			<view class="items" @tap="goTo('currencyTransfer/currencyTransfer')">
				<image class="bomIcon" src="~@/static/index/icon6.png"></image>
				<text class="iconTxt">{{languageInfo.currencyTransfer}}</text>
			</view>
			<view class="items" @tap="goTo('revenueRecords/revenueRecords')">
				<image class="bomIcon" src="~@/static/index/icon7.png"></image>
				<text class="iconTxt">{{languageInfo.revenueRecord}}</text>
			</view>
			<view class="items" @tap="exchangeNo">
				<image class="bomIcon" src="~@/static/index/icon8.png"></image>
				<text class="iconTxt">{{languageInfo.currencyExchange}}</text>
			</view>
		</view>
		<!-- 倒计时 -->
		<view class="CountdownBox" v-if="status==1">
			<view>{{languageInfo.countdown}}</view>
			<image src="../../static/index/botBom.png" class="borBom"></image>
			<view>
				<text class="days">{{hour}}</text>{{languageInfo.hour}}
				<text class="days">{{min}}</text>{{languageInfo.minute}}
				<text class="days">{{second}}</text>{{languageInfo.second}}
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
				usdtNum: 0, //USDT资产
				wifiNum: 0, //WIFI资产
				usdtEarn: 0, //USDT收益
				wifiEarn: 0, //WIFI收益
				bannerData: [{
					img: '../../static/index/bannerN1.png'
				}, {
					img: '../../static/index/bannerN2.png'
				}, {
					img: '../../static/index/bannerN3.png'
				}],
				bannerData2: [{
					img: '../../static/index/banner2N1.png'
				}, {
					img: '../../static/index/banner2N2.png'
				}, {
					img: '../../static/index/banner2N3.png'
				}],
				bannerData3: [{
					img: '../../static/index/banner3N1.png'
				}, {
					img: '../../static/index/banner3N2.png'
				}, {
					img: '../../static/index/banner3N3.png'
				}],
				bannerData4: [{
					img: '../../static/index/banner4N1.png'
				}, {
					img: '../../static/index/banner4N2.png'
				}, {
					img: '../../static/index/banner4N3.png'
				}],
				bannerData5: [{
					img: '../../static/index/banner5N1.png'
				}, {
					img: '../../static/index/banner5N2.png'
				}, {
					img: '../../static/index/banner5N3.png'
				}],
				bannerData6: [{
					img: '../../static/index/banner6N1.png'
				}, {
					img: '../../static/index/banner6N2.png'
				}, {
					img: '../../static/index/banner6N3.png'
				}],
				indicatorDots: true, //是否显示面板指示点
				vertical: false, //滑动方向是否为纵向
				autoplay: true, //是否自动切换
				interval: 2000, //自动切换时间间隔
				duration: 500, //滑动动画时长
				languageInfo: {},
				status: 0, //用户状态1、有效，2、无效
				hour: '00',
				min: '00',
				second: '00',
				times: '',
				lang:'',
				leaveNum:'0',//待释放
				timer:null
			}
		},
		components: {
			tabTop
		},
		onLoad() {
			_this = this
			
		},
		onShow() {
			_this.getCountDown()
			_this.getNum()
			_this.lang = uni.getStorageSync('lang')
			_this.languageInfo = this.linkTo.showLanguage();
			_this.getCurrency()
			uni.setTabBarItem({
				index: 0,
				text: this.languageInfo.signalPoint
			});
			uni.setTabBarItem({
				index: 1,
				text: this.languageInfo.globalBaseStation
			});
			uni.setTabBarItem({
				index: 2,
				text: this.languageInfo.indexs
			});
			uni.setTabBarItem({
				index: 3,
				text: this.languageInfo.marketPlace
			});
			uni.setTabBarItem({
				index: 4,
				text: this.languageInfo.mine
			})
		},
		onHide(){  
		    if(_this.timer) {  
		        clearInterval(_this.timer);  
		        _this.timer = null;  
		    }  
		},
		onUnload(){
			if(_this.timer) {
			    clearInterval(_this.timer);  
			    _this.timer = null;  
			} 
		},
		methods: {
			// 待释放总量
			getNum() {
				_this.get('api/releaseInfo').then(res => {
					_this.leaveNum = res.data.res.leave_num
				})
			},
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url);
			},
			// 币币兑换
			exchangeNo() {
				_this.linkTo.$noToast(_this.languageInfo.stayTuned)
			},

			// 倒计时
			getCountDown() {
				let timestamp = Date.parse(new Date())
				timestamp = timestamp / 1000;
				_this.get('api/validCountdown').then(res => {
					_this.status = res.data.res.status
					var time = res.data.res.time
					// let time = 1596099044
					if (time > 0) {
					 _this.timer = setInterval(() => {
							//定时器调用  直接传入时间戳即可
							_this.timeStamp(parseInt(time))
						}, 1000)
					}
					// _this.times = time - timestamp
					// let times = parseInt(time) - parseInt(timestamp)

				})
			},
			// 资产收益
			getCurrency() {
				_this.get('api/getUserCurrency').then(res => {
					_this.usdtEarn = res.data.res.usdt_earnings
					_this.wifiEarn = res.data.res.wifi_earnings
					_this.usdtNum = res.data.res.usdt_num
					_this.wifiNum = res.data.res.wifi_num
					uni.setStorageSync('usdt', res.data.res.usdt_num)
					uni.setStorageSync('wifi', res.data.res.wifi_num)
				})
			},
			// 倒计时
			timeStamp(times) {
				let timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				let letime = times - timestamp;
				let time = parseInt(letime);
				if (parseInt(letime) > 60) {
					let second = parseInt(letime) % 60;
					let min = parseInt(letime / 60);
					_this.min = min < 10 ? "0" + min : min
					_this.second = second < 10 ? "0" + second : second
					if (min > 60) {
						min = parseInt(letime / 60) % 60;
						// _this.min = min
						_this.min = min < 10 ? "0" + min : min
						var hour = parseInt(parseInt(letime / 60) / 60);
						// _this.hour = hour
						_this.hour = hour < 10 ? "0" + hour : hour
					}

				} else if (parseInt(letime) < 60 && parseInt(letime) >= 0) {
					_this.hour = '00'
					_this.min = '00'
					let second = parseInt(time);
					_this.second = second < 10 ? "0" + second : second
				}

				// 输出结果：
				// return time;
			}
		}
	}
</script>

<style scoped lang="scss">
	text {
		display: block;
		line-height: 1;
	}

	.mb18 {
		margin-bottom: 18rpx;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.content {
		@include bg();
		height: 100%;
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

		.logoIcon {
			width: 32rpx;
			height: 36rpx;
			margin-right: 8rpx;
		}

		.logoTxt {
			font-size: 35rpx;
			@include colF();
			font-weight: bold;
		}

		// 资产
		.assetxBox {
			// width: 100%;
			@include flexBet();
			height: 252rpx;
			margin: 0rpx 14rpx 20rpx 14rpx;
			box-sizing: border-box;

			.borBox {
				width: 140rpx;
			}

			.border {
				width: 140rpx;
				height: 2rpx;
				margin: 16rpx auto;
			}

			.assLeft,
			.assRight {
				@include cen();
				@include font26();
				@include colF();
				width: 352rpx;
				height: 252rpx;
				text-align: center;
				flex-direction: column;
				background-image: url(~@/static/index/top-bg1.png);
				background-size: 100% 100%;
			}

			.monCol {
				font-size: 35rpx;
				@include mainCol();
				font-weight: bold;
			}

			.downTxtCol {
				@include font24();
				color: #FF0D00;
			}

			.upTxtCol {
				@include font24();
				color: #3DFF00;
			}

			.todayTxt {
				@include font20();
				@include colF();
			}

		}

		// 待释放
		.freedBox {
			@include flexBet();
			height: 80rpx;
			margin: 0 20rpx;
			padding: 0 42rpx;
			border: 2rpx solid #72ADFF;
			box-shadow: inset 0 0 12rpx #041A30;
			border-radius: 6rpx;

			.freedLeft {
				display: flex;
				align-items: center;

				.allNum {
					@include font24();
					@include colF();
				}
			}

			.icon1 {
				width: 36rpx;
				height: 34rpx;
				margin-right: 8rpx;
			}

			.allWifi {
				@include font24();
				@include mainCol();
				font-weight: bold;
			}
		}

		// 充值
		.rechargeBox {
			@include cen();
			height: 100rpx;
			border-radius: 6rpx;
			border: 2rpx solid #72ADFF;
			margin: 20rpx;
			box-shadow: inset 0 0 70rpx #041A30;

			.icon2 {
				width: 42rpx;
				height: 38rpx;
				margin-right: 10rpx;
			}

			.rechTxt {
				@include font40();
				@include mainCol();
				font-weight: bold;
			}
		}

		// 轮播图
		.bannerBox {
			height: 200rpx;
			margin: 0 20rpx;
			border: 2rpx solid #72ADFF;

			.swiper {
				height: 200rpx;

				.itemImg {
					width: 100%;
					height: 200rpx;
					background-size: cover;
				}
			}
		}

		// 图标列表
		.bomBox {
			margin: 50rpx auto 0 auto;
			@include flexBet();
			flex-wrap: wrap;
			.items {
				width: 33.3%;
				text-align: center;
				margin-bottom: 48rpx;
			}

			.bomIcon {
				width: 76rpx;
				height: 82rpx;
			}

			.iconTxt {
				margin-top: 16rpx;
				@include font24();
				@include colF();
			}

		}

		// 倒计时
		.CountdownBox {
			// @include cen();
			@include font26();
			@include colF();
			display: flex;
			flex-direction: column;
			align-content: center;
			justify-content: center;
			text-align: center;
			height: 120rpx;
			margin: 0 20rpx 20rpx 20rpx;
			border: 2rpx solid #72ADFF;
			border-radius: 6rpx;
			box-shadow: inset 0 0 140rpx #041A30;

			.countTitle {}

			text {
				display: inline-block;
			}

			.days {
				@include font44();
				color: #FF2F2F;
				padding: 0 10rpx;
			}

			.borBom {
				width: 600rpx;
				height: 2rpx;
				margin: 12rpx auto 8rpx auto;
			}


			.icon10 {
				margin-left: 10rpx;
			}
		}


	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
