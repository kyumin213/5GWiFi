<template>
	<view class="containerBox">
		
		<view class="headTop">
			<view class="leftBox">
				<uni-icons :type="'back'" size="24"  @tap="back"/>
				<text class="logoTxt ml20">{{_getLge('release')}}</text>
			</view>
		</view>
	<!-- 	<view class="topNav">
			<tab-top left-icon="back" :title="_getLge('release')"></tab-top>
		</view> -->
		<view class="content">
			<view class="titles">
				<text>WiFi/USDT</text>
			</view>
			<view class="contenBox">
				<view class="items">
					<view>
						<text class="btns" :class="{'buyBtn':sellShow==false}" @tap="tabCheck(false)">{{_getLge('buy')}}</text>
						<text class="btns sellTab" :class="{'sellBtn':sellShow==true}" @tap="tabCheck(true)">{{_getLge('sell')}}</text>
					</view>
					<view>
						<view class="mt30">
							<picker @change="translate" :value="index" :range="_getLge('typesItem')" mode="selector" style="width: 100%;">
								<input type="text" class="buyType" :placeholder="_getLge('pleaseSelect')" disabled v-model="types">
								<text></text>
							</picker>
						</view>
						<view class="addBox mt30">
							<button class="lessBtn" @tap="buyNumDown">-</button>
							<input type="number" :disabled="index == 0?true:false" class="numInp" v-model="buyNum" :placeholder="_getLge('price')" @input="buyNumChange"></input>
							<button class="lessBtn" @tap="buyNumUp">+</button>
						</view>
						<view class="txt2">
							<!-- <text>≈64330.86 CNY</text> -->
						</view>
						<view class="numBox mt30">
							<input type="number" v-model="numWiFi" @input="numWiFiChange" class="numInp" :placeholder="_getLge('quantity')">
							<text class="numTxt">WiFi</text>
						</view>
						<view class="txt2">
							<text v-show="!sellShow">{{_getLge('beAbleToUse')}} {{usdt}} USDT</text>
							<text  v-show="sellShow">{{_getLge('beAbleToUse')}} {{wifiNum}} WIFI</text>
						</view>
						<view class="mt30 transBox">
							<text class="txt3">{{_getLge('TransactionAmount')}}</text>
							<text class="txt3">{{transactionValue}}</text>
						</view>
						<view class="handBox">
							<image class="tipIcon" src="~@/static/market/tipIcon.png"></image>
							<text class="txt4">{{_getLge('ServiceCharge')}}：</text>
							<text class="txt5" v-if="handlingFee != ''">{{handlingFee}}%</text>
						</view>
						<view class="mt30">
							<button class="buy" v-show="!sellShow" @tap="buyComfir">{{_getLge('buy')}}</button>
							<button class="buy sell" v-show="sellShow" @tap="sellComfir">{{_getLge('sell')}}</button>
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="buyBox outBox">
						<view class="titleBox">
							<text>{{_getLge('price')}}</text>
							<text>{{_getLge('quantity')}}</text>
						</view>
						<view class="countBox" v-for="item in sellList">
							<text class="txtBuy">{{item.entrust_price}}</text>
							<text class="txt6">{{item.entrust_num}}</text>
						</view>
					</view>
					<view class="txtPrice"><text>{{marketPrice}}</text></view>
					<view class="sellBox outBox">
						<view class="titleBox">
							<text>{{_getLge('price')}}</text>
							<text>{{_getLge('quantity')}}</text>
						</view>
						<view class="countBox" v-for="item in buyList">
							<text class="txtSell">{{item.entrust_price}}</text>
							<text class="txt6">{{item.entrust_num}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<scroll-view :lower-threshold="10" @scrolltolower="scrolltolowerMore" scroll-y="true"
		 class="listScroll">
				<view class="content2" v-if="listData.length > 0">
					<view class="itemList" v-for="(item,index) in listData">
						<view>
							<view>
								<text class="txt1">{{_getLge('transactionType')}}:</text>
								<text class="sellStatus buy" v-if="item.sell_id == '0'">{{_getLge('buy')}}</text>
								<text class="sellStatus"  v-if="item.buy_id == '0'">{{_getLge('sell')}}</text>
								<!-- <text class="sellStatus"  v-if="item.status == 3">{{_getLge('complete')}}</text>
								<text class="sellStatus" style="background: #AAAAAA;"   v-if="item.status == 4">{{_getLge('revoke')}}</text> -->
							</view>
							<view>
								<text class="txt1">{{item.sell_id == '0'?_getLge('buy'):_getLge('sell')}}{{_getLge('quantity')}}:</text>
								<text class="txt2">{{item.entrust_num}}</text>
							</view>
							<view>
								<text class="txt1">{{_getLge('transactionPrice')}}:</text>
								<text class="txt2">{{item.entrust_price}}</text>
							</view>
							<view>
								<text class="txt1">{{_getLge('turnover')}}:</text>
								<text class="txt2">{{item.success_num}}</text>
							</view>
							<view>
								<text class="txt1">{{_getLge('tradingHours')}}:</text>
								<text class="txt2">{{timeCpd(item.add_time)}}</text>
							</view>
						</view>
						<view  v-if="item.status < 3" class="unDoBtn" @tap="unDo(item.id,index)">
							<image class="btnIcon" src="~@/static/market/icon2.png"></image>
							<text>{{_getLge('revoke')}}</text>
						</view>
						<view  v-if="item.status == 3" style="color: #3CFF41;" class="unDoBtnTop">
							<text>{{_getLge('complete')}}</text>
						</view>
						<view  v-if="item.status == 4" style="color: #AAAAAA;" class="unDoBtnTop">
							<text>{{_getLge('revoke')}}</text>
						</view>
					</view>
				</view>
				<view class="content" v-if="listData.length == 0">
					<text class="zero" v-if="firstReq == false">{{_getLge('noMore')}}</text>
				</view>
		</scroll-view>
		<!-- 确认发布弹窗-->
		<uni-popup ref="popup" type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{_getLge('confirmRelease')}}</text>
					</view>
					<view class="txt1">
						<text>{{title}}</text>
					</view>
					<view class="item">
						<text class="txt2">{{numWiFi}}</text>
						<text class="txt3">WiFi</text>
					</view>
					<view v-show="modelType == 1" class="tipBox">
						<image src="~@/static/index/icon13.png" class="icon13"></image>
						<view>
							<view class="tipText">{{_getLge('ServiceCharge')}} : {{handlingFee}}%</view>
							<!-- <view class="tipText">{{_getLge('actualReceipt')}} : {{actualAccount}} WiFi</view> -->
						</view>
					</view>
					<view>
						<input class="inp" password type="text" v-model="payPwd" :placeholder="_getLge('enterPayPwd')">
					</view>
					<view>
						<button class="btns" @tap="chekMarket">{{_getLge('confirm')}}</button>
					</view>
					<view class="mb52">
						<button class="btns" @tap="closeModal">{{_getLge('cancel')}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 撤销弹窗 -->
		<uni-popup ref="popup2" type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{_getLge('tips')}}</text>
					</view>
					<view class="allTotal">
						<text>{{_getLge('toRevoke')}}?</text>
					</view>
					<!-- <view class="unDoNumBox">
						<text class="txt2">{{unDoNum}}</text>
						<text class="txt3">WiFi</text>
					</view> -->
					<view>
						<button class="subBtn" @tap="cancelOrder">{{_getLge('confirm')}}</button>
					</view>
					<view class="mb44">
						<button class="subBtn" @tap="closeModal2">{{_getLge('cancel')}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		data() {
			return {
				sellShow: false, //购买、出售按钮
				marketPrice: 0,
				types: '', //选中的类型
				usdt: 0, //可用USDT
				wifiNum:0,
				index: 1,
				buyNum: '', //购买数量
				numWiFi: '', //WiFi数量
				transactionValue: '--', //交易额
				handlingFee: '', //手续费
				payPwd: '', //支付密码
				actualAccount: 0, //实际到账
				sellList: [], //深度 sell
				buyList: [], //深度 buy
				title:'',
				modelType:1,
				statusShow: false, //出售、购买状态按钮
				unDoNum: '200', //撤销出售、购买数量
				listData: [],
				lastPage: 2,
				currentPage: 1,
				perPage: 20,
				currentId: '',
				currentIndex: 0,
				firstReq:true
			}
		},
		components: {
			tabTop,
			uniPopup
		},
		onShow() {
			this.types = this._getLge('typesItem')[this.index]
			// 可用USDT
			this.usdt = uni.getStorageSync('usdt');
			this.wifiNum = uni.getStorageSync('wifi');
			this.getMaketPrice()
			this.getDept()
			// 手续费
			this.get('api/getServiceCharge').then(res => {
				if (res.data.code == 200) {
						this.handlingFee = parseFloat(res.data.res.otc_fee * 100)
				} else {
					this.linkTo.$noToast(res.data.message)
				}
			})
			this.getList()
		},
		methods: {
			// 跳转
			goTo(url) {
				this.linkTo.navTo(url)
			},
			numWiFiChange(){
				this.getTrans()
			},
			buyNumChange(){
				this.getTrans()
			},
			getDept(){
				// 深度
				this.get('api/depth').then(res => {
					if (res.data.code == 200) {
						this.sellList = res.data.res.sell
						this.buyList = res.data.res.buy
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			getTrans(){
				if(this.buyNum === '' || this.numWiFi === ''){
					this.transactionValue = '--'
					return
				}
				function accMul(arg1, arg2) {
				    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
				    try { m += s1.split(".")[1].length } catch (e) { }
				    try { m += s2.split(".")[1].length } catch (e) { }
				    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
				}
				// 处理精度问题
				let res = accMul(Number(this.buyNum), Number(this.numWiFi))
				this.transactionValue = res.toFixed(3)
			},
			// 按钮切换
			tabCheck(bool) {
				let _this = this
				_this.sellShow = bool
			},
			// 选择类型
			translate: function(e) {
				let _this = this
				_this.index = e.detail.value
				let index = e.detail.value
				_this.types = _this._getLge('typesItem')[index]
				if(_this.index == 0){
					_this.buyNum = _this.marketPrice
				this.transactionValue = Number(this.buyNum) * Number(this.numWiFi)
				}else if(_this.index == 1){
					this.transactionValue = '--'
					_this.buyNum = ''
				}
			},
			// 购买确认
			buyComfir() {
				let _this = this
				this.title = this._getLge('buyQuantity')
				this.modelType = 1
				if (this.buyNum == '' || this.buyNum <=0) {
					this.linkTo.$noToast(this._getLge('enterTheCorrect'))
					return
				}
				if(this.numWiFi == '' || this.numWiFi <=0){
					this.linkTo.$noToast(this._getLge('enterTheCorrectQuantity'))
					return
				}
				_this.$refs.popup.open();
			},
			sellComfir(){
				let _this = this
				this.title = this._getLge('sellQuantity')
				this.modelType = 2
				if (this.buyNum == '' || this.buyNum <=0) {
					this.linkTo.$noToast(this._getLge('enterTheCorrect'))
					return
				}
				if(this.numWiFi == '' || this.numWiFi <=0){
					this.linkTo.$noToast(this._getLge('enterTheCorrectQuantity'))
					return
				}
				_this.$refs.popup.open();
			},
			// 购买取消
			closeModal() {
				let _this = this
				_this.$refs.popup.close()
				this.payPwd = ''
			},
			// 购买数量
			checkNum(value) {
				// console.log(value);
			},
			buyNumDown() {
				if (this.buyNum !== '' && this.index != 0) {
					this.buyNum = Number(this.buyNum ) - 1
					if (this.buyNum < 0) {
						this.buyNum = 0
					}
				}
			},
			buyNumUp() {
					console.log(this.buyNum != '');
				if (this.buyNum !== '' && this.index != 0) {
					this.buyNum = Number(this.buyNum ) + 1
				}
			},
			// 确认发布
			chekMarket() {
				if (this.payPwd == '') {
					this.linkTo.$noToast(this._getLge('enterPayPwd'))
					return
				}
				// 验证支付密码
				this.post('api/paymentPasswordVerify', {
					password: this.payPwd
				}).then(res => {
					if (res.data.code == 200) {
						this.entryOrder()
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			// 挂单
			entryOrder() {
				let params = {}
				if(this.index == 0){
					params = {
						entrust_num: this.numWiFi,
						type: this.modelType,
					}
				}
				
				if(this.index == 1){
					params = {
						entrust_num: this.numWiFi,
						type: this.modelType,
						entrust_price:this.buyNum,
					}
				}
				this.post('api/entryOrder', params).then(res => {
					if (res.data.code == 200) {
						//重新请求余额并缓存
						this.get('api/getUserCurrency').then(res => {
							this.usdtNum = res.data.res.usdt_num
							this.wifiNum = res.data.res.wifi_num
							uni.setStorageSync('usdt', res.data.res.usdt_num)
							uni.setStorageSync('wifi', res.data.res.wifi_num)
							setTimeout(()=>{
								uni.showToast({
									title: this._getLge('publishSuccessfully'),
									type: 'success',
									duration: 1000
								});
								this.$refs.popup.close()
							},50)
							this.payPwd = ''
							// 表单恢复默认
							this.numWiFi = ''
							this.buyNum = ''
							this.index = 1
							this.types = this._getLge('typesItem')[this.index]
							this.getListNew();
							this.getDept();
						})
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			getMaketPrice(){
				// 市场价
				this.get('api/getMarketPrice').then(res => {
					if (res.data.code == 200) {
						this.marketPrice = res.data.res.marketPrice
						if(this.index == 0){
							this.buyNum = this.marketPrice
						}
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
				timeCpd(data) {
					let date = new Date(Number(data) * 1000);
					var YY = date.getFullYear() + '-';
					var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
					var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
					var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
					var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
					return YY + MM + DD + " " + hh + mm + ss;
				},
				// 撤销
				unDo(id, index) {
					let _this = this
					this.currentId = id
					this.currentIndex = index
					_this.$refs.popup2.open();
				},
				// 取消
				closeModal2() {
					let _this = this
					_this.$refs.popup2.close();
				},
				getListNew(){
						this.perPage = 20
						this.currentPage = 1
						this.lastPage = 2
						this.listData = []
						let data = {
							rowNum: this.perPage,
							page: this.currentPage,
						}
						this.get('api/historyEntrust', data).then(res => {
							if (res.data.code == 200) {
								let data = res.data.res
								if (data.data.length == 0 && !this.firstReq) {
									uni.showToast({
										icon: 'none',
										title: this._getLge('thereIsNoMoreData'),
										duration: 1000
									})
								}
								this.firstReq = false
								this.lastPage = data.last_page
								this.currentPage = this.currentPage + 1
								this.listData = this.listData.concat(data.data)
							} else {
								this.linkTo.$noToast(res.data.message)
							}
						})
				},
				getList() {
					let data = {
						rowNum: this.perPage,
						page: this.currentPage,
					}
					this.get('api/historyEntrust', data).then(res => {
						if (res.data.code == 200) {
							let data = res.data.res
							if (data.data.length == 0 && !this.firstReq) {
								uni.showToast({
									icon: 'none',
									title: this._getLge('thereIsNoMoreData'),
									duration: 1000
								})
							}
							this.firstReq = false
							this.lastPage = data.last_page
							this.currentPage = this.currentPage + 1
							this.listData = this.listData.concat(data.data)
							console.log(this.listData);
						} else {
							this.linkTo.$noToast(res.data.message)
						}
					})
				},
				// 加载更多
				scrolltolowerMore() {
					if (this.currentPage > this.lastPage) {
						uni.showToast({
							icon: 'none',
							title: this._getLge('thereIsNoMoreData'),
							duration: 1000
						})
						return
					}
					this.getList()
				},
				cancelOrder() {
					this.post('api/cancelOrder', {
						id: this.currentId
					}).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: this._getLge('revocationSuccessful'),
								type: 'success',
								duration: 1000
							});
							this.listData[this.currentIndex].status = 4
							this.$refs.popup2.close();
						} else {
							this.linkTo.$noToast(res.data.message)
						}
					})
				},
				back(){
					uni.$emit('downK',false)
					uni.navigateBack()
				}
		}
	}
</script>
<style lang="scss" scoped>
	.mt30 {
		margin-top: 30rpx;
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
		display: flex;
		flex-direction: column;
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
			justify-content: space-between;
			align-items: center;
			z-index: 10;
			background: #0d1424;
			.leftBox{
				display: flex;
				align-items: center;
			}
			.logoIcon {
				width: 32rpx;
				height: 36rpx;
				margin-right: 8rpx;
			}
			
			.logoTxt {
				@include colF();
				font-weight: bold;
				font-size: 35rpx;
			}
			.rightBox{
				margin-right: 0;
				padding-right: 28rpx;
			}
		}
	}
	.content {
		margin: 0rpx 30rpx 100rpx 30rpx;

		.titles {
			@include font40();
			@include colF();
			font-weight: bold;
			text-align: center;
		}

		.contenBox {
			@include flexBet();
			align-items: flex-start;
			margin-top: 42rpx;
			height: 620rpx;

			.tipIcon {
				width: 24rpx;
				height: 24rpx;
			}

			.boxRight {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 100%;
				margin-left: 36rpx;
				.outBox {
					width: 100%;
					height: 290rpx;
					.titleBox {
						color: #AAAAAA;
						font-size: 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;
					}
				}

				.countBox {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.txt6{
						margin: 10rpx 0;
						font-size: 24rpx;
						color: #FFFFFF;
					}
					.txtSell {
						margin: 10rpx 0;
						font-size: 24rpx;
						color: #0AE8CB;
					}

					.txtBuy {
						margin: 10rpx 0;
						font-size: 24rpx;
						color: #ED4747;
					}
				}

				.txtPrice {
					color: #0AE8CB;
					font-size: 20rpx;
					margin-top: 10rpx;
					margin-bottom: 20rpx;
					font-size: 36rpx;
				}
			}

			.items {
				.btns {
					@include font26();
					@include colF();
					display: inline-block;
					width: 200rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					border: 2rpx solid #3CF8FF;
					border-radius: 6rpx;
					box-sizing: border-box;
				}

				.buyBtn {
					color: #0E1724;
					background: linear-gradient(to top, #009BF0, #3CF8FF);
				}

				.sellTab {
					border: 2rpx solid #319BFF;
				}

				.sellBtn {
					color: #0E1724;
					background: linear-gradient(to top, #B17DFF, #319BFF);
				}

				.buyType {
					display: inline-block;
					@include borCol();
					@include colF();
					@include font24();
					width: 400rpx;
					height: 54rpx;
					line-height: 54rpx;
					border-radius: 6rpx;
					padding: 0 22rpx;
					box-sizing: border-box;
					position: relative;
				}

				.buyType:after {
					content: '';
					width: 0;
					height: 0;
					border-left: 10rpx solid transparent;
					border-right: 10rpx solid transparent;
					border-top: 16rpx solid #3CF8FF;
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}

				.addBox {
					@include around();
					@include borCol();
					@include mainCol();
					align-items: center;
					box-sizing: border-box;
					border-radius: 6rpx;
					height: 80rpx;

					.lessBtn {
						@include colA();
					}

					.numInp {
						@include font24();
						width: 240rpx;
						height: 80rpx;
						text-align: center;
						border-left: 2rpx solid #3CF8FF;
						border-right: 2rpx solid #3CF8FF;
					}
				}

				.txt {
					display: block;
					@include font24();
					line-height: 50rpx;
				}

				.txt2 {
					margin-top: 10rpx;
					@include colA();
					@include font20();
				}

				.numBox {
					@include borCol();
					@include flexBet();
					width: 400rpx;
					height: 80rpx;
					border-radius: 6rpx;
					padding: 0 20rpx;
					box-sizing: border-box;

					.numInp {
						@include font24();
						@include mainCol();
						color: #3CF8FF;
					}

					.numTxt {
						@include font30();
						@include colF();
					}
				}

				// 交易额
				.transBox {
					@include flexBet();

					.txt3 {
						@include font24();
						@include mainCol();
					}
				}

				// 手续费
				.handBox {
					margin-top: 44rpx;
					display: flex;

					.txt4 {
						@include font20();
						@include mainCol();
						margin-left: 10rpx;
					}

					.txt5 {
						@include font20();
						@include colF();
					}
				}

				// 价格、数量
				.priceTxt,
				.numberTxt {
					@include font26();
					@include colA();
				}

				.priceBox {

					.txt {
						color: #ED4747;
						text-align: left;
					}
				}

				.numberBox {
					@include colF();
					text-align: right;
				}
			}

			.buy {
				@include font26();
				width: 400rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: linear-gradient(to top, #3CF8FF, #009BF0);
				border-radius: 6rpx;
			}

			.sell {
				background: linear-gradient(to top, #B17DFF, #319BFF);
			}

		}

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
			@include font20();
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
	
	// 记录
	.mb44 {
		margin-bottom: 44rpx;
	}
	.listScroll{
		height: 100%;
		width:auto;
		border-top: 1px solid #3CF8FF;
		border-radius: 10rpx;
		min-height: 100rpx;
		flex: 1;
		margin: 0 20rpx;
	}
	.content2 {
		.itemList:first-child{
			border-top: none;
		}
		.itemList {
			@include borCol();
			@include flexBet();
			align-items: flex-end;
			border-radius: 10rpx;
			padding: 46rpx 40rpx;
			box-sizing: border-box;
			margin-bottom: 10rpx;
			position: relative;
			.txt1 {
				@include mainCol();
				@include font24();
				margin-right: 12rpx;
			}
	
			.txt2 {
				@include colF();
				@include font24();
			}
	
			.sellStatus {
				@include colF();
				@include font22();
				display: inline-block;
				padding: 6rpx 14rpx;
				background: #1ABA29;
				border-radius: 4rpx;
			}
	
			.buy {
				background: #FF3C3C;
			}
			.unDoBtnTop{
				@include font26();
				@include cen();
				height: 44rpx;
				line-height: 44rpx;
				padding: 0 22rpx;
				border-radius: 22rpx;
				position: absolute;
				top: 40rpx;
				right: 32rpx;
			}
			.unDoBtn {
				@include font20();
				@include cen();
				height: 44rpx;
				line-height: 44rpx;
				padding: 0 22rpx;
				background: linear-gradient(to top, #3CF8FF, #009BF0);
				border-radius: 22rpx;
				position: relative;
				top: 6rpx;
			}
	
			.btnIcon {
				width: 26rpx;
				height: 24rpx;
				margin-right: 6rpx;
			}
		}
	}
	
	// 弹窗
	.modalBox {
		.modalCon {
			@include borCol();
			border-radius: 10rpx;
			background: #021628;
			position: fixed;
			top: 50%;
			left: 154rpx;
			right: 154rpx;
			transform: translateY(-50%);
			z-index: 150;
	
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
	
			.allTotal {
				@include font28();
				@include colF();
				text-align: center;
				margin: 40rpx auto 40rpx auto;
			}
	
			.unDoNumBox {
				text-align: center;
				padding-bottom: 30rpx;
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
	
			.subBtn {
				height: 60rpx;
				line-height: 54rpx;
				@include borCol();
				@include font24();
				@include colF();
				margin: 20rpx 40rpx;
				border-radius: 4rpx;
			}
	
		}
	}
	.zero{
		text-align: center;
		display: block;
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx 40rpx 20rpx;
		font-size: 30rpx;
		color: #FFFFFF;
	}
</style>
