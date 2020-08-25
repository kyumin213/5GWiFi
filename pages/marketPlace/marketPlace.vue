<template>
	<view class="content">
		<view class="headTop">
			<view class="headTopTitle">
				<image class="logoIcon" src="~@/static/market/logo.png"></image>
				<text class="logoTxt ml20">{{language['marketPlace']}}</text>
			</view>
			<view class="release fx" @tap="goTo('releaseMarket/releaseMarket')">
				<image class="icon1" src="~@/static/market/icon1.png"></image>
			</view>
		</view>
		<!-- 名字title -->
		<view class="titles">
			<text>WiFi/USDT</text>
		</view>

		<!-- 价格高低 -->
		<view class="priceFluBox">
			<view>
				<view class="price1" :style="{color:rateColor}">{{last}}</view>
				<view class="price2">
					<text>≈{{(last * 7).toFixed(2)}}</text>
					<text>CNY</text>
					<text :style="{color:rateColor}" class="rateTxt">{{rate}}%</text>
				</view>
			</view>
			<view>
				<view class="itemFlex">
					<text class="priceTxt" style="display: block; min-width: 30rpx;">{{language['high']}}</text>
					<text class="priceTxt2">{{high}}</text>
				</view>
				<view class="itemFlex">
					<text class="priceTxt" style="display: block; min-width: 30rpx;">{{language['low']}}</text>
					<text class="priceTxt2">{{low}}</text>
				</view>
				<view class="itemFlex">
					<text class="priceTxt" style="display: block; min-width: 30rpx;">{{language['openVal']}}</text>
					<text class="priceTxt2">{{openVal}}</text>
				</view>
				<view class="itemFlex">
					<text class="priceTxt" style="display: block; min-width: 30rpx;">{{language['closeVal']}}</text>
					<text class="priceTxt2">{{closeVal}}</text>
				</view>
				<view class="itemFlex">
					<text class="priceTxt" style="display: block; min-width: 30rpx;">24H</text>
					<text class="priceTxt2">{{volume_24h}}</text>
				</view>
			</view>
		</view>
		<view class="tabsBox fx">
			<view class="tabsItem" :class="[activeTabs==index?'activeTab':'']" v-for="(item,index) in tabs" :key="item.id"
			 @click="tabsChange(index)">
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="moveBorder">
			<view class="moveBorderImg" :style="{width:moveWidth + 'px',left:moveLeft + 'px'}"></view>
		</view>
		<!-- K线图 -->
		<view class="qiun-columns">
			<div class="divchart">
				<!--  #ifndef  H5 -->
				<view>
					<canvas id="kline2" canvas-id="kline2" class="kline2" style="background: rgb(17,26,44);" v-bind:style="{ width: ChartWidth + 'px', height: ChartHeight + 'px' }"
					 v-show="KLine.IsShow" @touchstart="KLineTouchStart" @touchmove="KLineTouchMove" @touchend="KLineTouchEnd"></canvas>
				</view>
				<!--  #endif -->
			</div>
		</view>
	</view>
</template>

<script>
	// #ifndef H5
	import {
		JSCommon
	} from '@/components/umychart.uniapp/umychart.wechat.3.0.js';
	import {
		JSCommonHQStyle
	} from '@/components/umychart.uniapp/umychart.style.wechat.js'
	// #endif

	import sha256 from "../../util/sha256.js";
	import tabTop from '@/components/tabTop.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';

	function DefaultData() {}
	DefaultData.GetKLineOption = function() {
		let data = {
			Type: '历史K线图',
			Language: 'CN',
			//窗口指标
			Windows: [{
					Index: 'MA',
					Modify: false,
					Change: false
				},
				{
					Index: 'VOL',
					Modify: false,
					Change: false
				},
			],

			IsCorssOnlyDrawKLine: true,
			CorssCursorTouchEnd: true,
			IsClickShowCorssCursor: true,
			IsAutoUpdate: false,
			IsApiPeriod: true, //使用Api计算周期
			AutoUpdateFrequency: 5000, //数据更新频率 msIsClickShowCorssCursor:true,    //手势点击出现十字光标
			CorssCursorInfo: {
				Left: 0,
				Right: 2,
				Bottom: 2,
				IsShowCorss: true
			}, //十字光标刻度设置 Left, Right, Bottom十字光标刻度显示设置 0=不显示 1=现在在框外 2=显示在框内
			//边框
			Border: {
				Left: 0,
				Right: 30, //右边间距
				Top: 30,
				Bottom: 30,
			},
			KLine: {
				DragMode: 1,
				Right: 1, //复权 0 不复权 1 前复权 2 后复权
				Period: 0, //周期: 0 日线 1 周线 2 月线 3 年线
				PageSize: 30,
				IsShowTooltip: true,
				DrawType: 0
			},

			//标题设置
			KLineTitle: {
				IsShowName: true, //不显示股票名称
				IsShowSettingInfo: true //不显示周期/复权
			},
			//子框架设置
			Frame: [{
				SplitCount: 5,
				IsShowLeftText: false,
				Custom: [{
					Type: 0,
					Position: 'right',
				}]
			}, {
				SplitCount: 4,
				Height: 6,
				IsShowLeftText: false,
				Custom: [{
					Type: 0,
					Position: 'right',
				}]
			}],
			language: {}
		};

		return data;
	};

	//周期枚举
	var KLINE_PERIOD_ID = {
		KLINE_DAY_ID: 0,
		KLINE_WEEK_ID: 1,
		KLINE_MONTH_ID: 2,
		KLINE_YEAR_ID: 3,

		KLINE_MINUTE_ID: 4,
		KLINE_5MINUTE_ID: 5,
		KLINE_15MINUTE_ID: 6,
		KLINE_30MINUTE_ID: 7,
		KLINE_60MINUTE_ID: 8,
		KLINE_240MINUTE_ID: 12,
	};


	DefaultData.GetPeriod = function() //周期菜单
	{
		var data = [{
				Name: '分时',
				Period: KLINE_PERIOD_ID.KLINE_MINUTE_ID,
				Times: 60
			},
			{
				Name: '周线',
				Period: KLINE_PERIOD_ID.KLINE_WEEK_ID,
				Times: 86400 * 7
			},
			{
				Name: '日线',
				Period: KLINE_PERIOD_ID.KLINE_DAY_ID,
				Times: 86400
			},
			{
				Name: '1小时',
				Period: KLINE_PERIOD_ID.KLINE_60MINUTE_ID,
				Times: 3600
			},
			{
				Name: '1分钟',
				Period: KLINE_PERIOD_ID.KLINE_MINUTE_ID,
				Times: 60
			},
			{
				Name: '15分钟',
				Period: KLINE_PERIOD_ID.KLINE_15MINUTE_ID,
				Times: 900
			},
		];
		return data;
	}

	var g_KLine = {
		JSChart: null
	};
	var g_Minute = {
		JSChart: null
	};
	//第3方api 验证
	const API_KEY = 'e623cde183dd55841a2515d18488be48';
	const SECRET_KEY = '03f2cf1a6c5c426ad9957cfb8e5ceb0a';

	function sup0(n) {
		if (n < 10) {
			return "0" + n;
		}
		return n;
	}

	function yMdhms(date) {
		if (!date) date = new Date();
		var y = date.getFullYear();
		var M = sup0(date.getMonth() + 1);
		var d = sup0(date.getDate());
		var h = sup0(date.getHours());
		var m = sup0(date.getMinutes());
		var s = sup0(date.getSeconds());
		return '' + y + M + d + h + m + s;
	}
	export default {
		data() {
			return {
				last: 0,
				rate: 0,
				low: 0,
				high: 0,
				volume_24h: 0,
				openVal: 0,
				closeVal: 0,
				activeTabs: 0,
				tabs: [{
						id: 1,
						name: '1分钟',
					},
					{
						id: 2,
						name: '15分钟',
					},
					{
						id: 3,
						name: '1小时',
					},
					{
						id: 4,
						name: '1天',
					},
				],
				moveWidth: 0,
				moveLeft: 0,
				moveWidth2: 0,
				moveLeft2: 0,
				Symbol: 'ETH/BTC.bit', //内部代码增加数值货币后缀.bit
				Name: '',
				PairName: 'ETH/BTC', //货币代码
				ChartWidth: uni.upx2px(748),
				ChartHeight: 400,
				KLine: {
					Option: DefaultData.GetKLineOption(),
					IsShow: true
				},

				KLINE_PERIOD_ID: KLINE_PERIOD_ID,
				tab: 1,
				scrollTop: 0,
				drawerShow: false,
				depth: [],
				currentpage: 1,
				rowNum: 30,
				lastPage: 2,
				title: '',
				modelType: 1,
				type15m: null,
				type1h: null,
				type1m: null,
				type1d: null,
				downK: false,
				rateColor: '#a5a5a5',
				itv0: null,
				itv1: null,
				itv2: null,
				itv3: null,
				itvMain:null
			}
		},
		components: {
			tabTop,
			uniPopup
		},
		onShow() {
			uni.$on('downK', (data) => {
				this.downK = data
			})
			this.language = this._lge[uni.getStorageSync('lang')]
			this.$forceUpdate()
			this.getPriceData()
			this.itvMain = setInterval(()=>{
				this.getPriceData()
			},5000)
			this.tabsChange(this.activeTabs)
		},
		onHide() {
			clearInterval(this.itvMain)
		},
		mounted() {
			this.OnSize();
			const query = uni.createSelectorQuery().in(this);
			query.select('.tabsItem').boundingClientRect(data => {
				this.moveWidth = data.width
				this.moveLeft = 0 * this.moveWidth
			}).exec();
		},
		methods: {
			getPriceData(){
				// K线图数据请求
				this.get('api/kLine', {
					page: this.currentpage,
					rowNum: this.rowNum,
					type: 1,
				},false).then(res => {
					if (res.data.code == 200) {
						let recvData = res.data.res
						this.lastPage = res.data.res.last_page
						if (res.data.res.current_page == 1) {
							this.rate = (recvData.data[recvData.data.length - 1].rate * 100).toFixed(2)
							let rate = Number(this.rate)
							if (rate > 0) {
								// 涨
								this.rateColor = 'rgb(37,175,142)'
							} else if (rate < 0) {
								// 跌
								this.rateColor = '#FF2C2C'
							} else {
								this.rateColor = '#a5a5a5'
							}
							this.last = recvData.data[recvData.data.length - 1].last
						}
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
				this.get('api/kLine', {
					page: this.currentpage,
					rowNum: this.rowNum,
					type: 7,
				},false).then(res => {
					if (res.data.code == 200) {
						let recvData = res.data.res
						console.log(recvData, '日');
						this.lastPage = res.data.res.last_page
						if (res.data.res.current_page == 1) {
							this.low = recvData.data[recvData.data.length - 1].low
							this.high = recvData.data[recvData.data.length - 1].high
							this.volume_24h = recvData.data[recvData.data.length - 1].volume_24h
							this.openVal = recvData.data[recvData.data.length - 1].kaipan_price
							this.closeVal = recvData.data[recvData.data.length - 1].shoupan_price
						}
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			// 跳转
			goTo(url) {
				this.linkTo.navTo(url)
			},
			tabsChange(index) {
				this.activeTabs = index
				this.moveLeft = index * this.moveWidth
				switch (index) {
					case 0:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_MINUTE_ID)
						// 关闭其他定时器
						// this.itv0 = setInterval(()=>{
						// 	console.log('1分钟定时器');
						// 	this.interChange(0)
						// },5000)
						break;
					case 1:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_15MINUTE_ID)
						// 关闭其他定时器
						// this.itv1 = setInterval(()=>{
						// 	console.log('15分钟定时器');
						// 	this.interChange(1)
						// },5000)
						break;
					case 2:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_60MINUTE_ID)
						// 关闭其他定时器
						// this.itv2 = setInterval(()=>{
						// 	console.log('60分钟定时器');
						// 	this.interChange(2)
						// },5000)
						break;
					case 3:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_DAY_ID)
						// 关闭其他定时器
						// this.itv3 = setInterval(()=>{
						// 	console.log('1天钟定时器');
						// 	this.interChange(3)
						// },5000)
						break;
					default:
						break;
				}
			},
			interChange(index) {
				this.downK = false
				switch (index) {
					case 0:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_MINUTE_ID)
						break;
					case 1:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_15MINUTE_ID)
						break;
					case 2:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_60MINUTE_ID)
						break;
					case 3:
						this.ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_DAY_ID)
						break;
					default:
						break;
				}
			},
			GetPeriodInfo(period) {
				const PERIOD_LIST = DefaultData.GetPeriod();
				for (var i in PERIOD_LIST) {
					var item = PERIOD_LIST[i];
					if (item.Period == period) return item;
				}

				return null;
			},

			ChangeSymbol(pairName) {
				this.PairName = pairName;
				this.Symbol = pairName + '.bit';

				if (g_Minute.JSChart) g_Minute.JSChart.ChangeSymbol(this.Symbol);
				if (g_KLine.JSChart) g_KLine.JSChart.ChangeSymbol(this.Symbol);
			},
			OnSize() {
				// #ifdef H5
				// this.OnSize_h5();
				// #endif
			},
			drawerShowChange() {
				this.drawerShow = !this.drawerShow;
			},

			CreateKLineChart_app() {
				if (g_KLine.JSChart && this.downK) return;
				this.downK = true
				let element = new JSCommon.JSCanvasElement();
				// #ifdef APP-PLUS
				element.IsUniApp = true; //canvas需要指定下 是uniapp的app
				// #endif
				element.ID = 'kline2';
				element.Height = this.ChartHeight; //高度宽度需要手动绑定!!
				element.Width = this.ChartWidth;
				this.SetBlackStyle_app();
				g_KLine.JSChart = JSCommon.JSChart.Init(element);
				this.KLine.Option.NetworkFilter = this.NetworkFilter;
				this.KLine.Option.Symbol = this.Symbol;
				this.KLine.Option.IsClickShowCorssCursor = true;
				this.KLine.Option.IsFullDraw = true;
				g_KLine.JSChart.SetOption(this.KLine.Option);
			},

			//设置app黑色风格
			SetBlackStyle_app() {
				var blackStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID.BLACK_ID);
				blackStyle.BGColor = 'rgb(2,23,37)'; //背景
				blackStyle.SelectRectBGColor = 'rgb(2,23,37)';
				blackStyle.FrameTitleBGColor = 'rgb(16,28,45)'; //指标标题背景
				blackStyle.FrameSplitTextColor = 'rgb(255,255,255)'; //刻度颜色

				//K线颜色
				blackStyle.UpBarColor = 'rgb(37,175,142)';
				blackStyle.UpTextColor = 'rgb(37,175,142)';
				blackStyle.DownBarColor = 'rgb(210,73,99)';
				blackStyle.DownTextColor = 'rgb(210,73,99)';

				//指标线段颜色
				blackStyle.ColorArray[0] = 'rgb(222,217,167)';
				blackStyle.ColorArray[1] = 'rgb(113,161,164)';
				blackStyle.ColorArray[2] = 'rgb(170,165,219)';

				//最新价格刻度颜色
				blackStyle.FrameLatestPrice.UpBarColor = 'rgb(37,175,142)';
				blackStyle.FrameLatestPrice.DownBarColor = 'rgb(210,73,99)';

				//面积图颜色
				blackStyle.CloseLineColor = 'rgb(113,121,133)'; //收盘价线颜色
				blackStyle.CloseLineAreaColor = ['rgba(36,41,57,0.8)', 'rgba(22,34,53,0.3)']; //收盘价面积图颜色

				//max,min color
				blackStyle.KLine.MaxMin.Color = 'rgb(255,250,240)';

				JSCommon.JSChart.SetStyle(blackStyle);
			},

			CreateKLineChart() {

				// #ifndef H5
				this.CreateKLineChart_app();
				// #endif
			},

			CreateMinuteChart_app() {
				if (g_Minute.JSChart) return;

				var element = new JSCommon.JSCanvasElement();
				// #ifdef APP-PLUS
				element.IsUniApp = true; //canvas需要指定下 是uniapp的app
				// #endif
				element.ID = 'minute2';
				element.Height = this.ChartHeight; //高度宽度需要手动绑定!!
				element.Width = this.ChartWidth;
				var blackStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID.BLACK_ID);
				JSCommon.JSChart.SetStyle(blackStyle);

				g_Minute.JSChart = JSCommon.JSChart.Init(element);
				this.Minute.Option.NetworkFilter = this.MinuteNetworkFilter;
				this.Minute.Option.Symbol = this.Symbol;
				this.Minute.Option.IsFullDraw = true;
				g_Minute.JSChart.SetOption(this.Minute.Option);
			},


			MinuteNetworkFilter(data, callback) {
				console.log('[BitKLine::NetworkFilter] data', data, this.Minute.Days);
				switch (data.Name) {
					case 'KLineChartContainer::ReqeustHistoryMinuteData': //分钟全量数据下载
						this.ReqeustHistoryMinuteData(data, callback, {
							PageSize: this.Minute.Days * 100
						}); //显示几条的数据
						break;
					case 'KLineChartContainer::RequestMinuteRealtimeData': //分钟实时数据更新
						this.RequestMinuteRealtimeData(data, callback);
						break;
				}
			},
			CreateMinuteChart() {
				// #ifdef H5
				this.CreateMinuteChart_h5();
				// #endif

				// #ifndef H5
				this.CreateMinuteChart_app();
				// #endif
			},
			//K线周期切换
			// ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_DAY_ID,{ KLine:{DrawType:0}})
			ChangeKLinePeriod: function(period, option) {
				if (!g_KLine.JSChart && !this.downK) {
					//不存在创建
					this.KLine.Option.KLine.Period = period;
					this.CreateKLineChart();
				} else {
					if (!this.downK) {
						this.KLine.Option.KLine.Period = period;
						this.CreateKLineChart();
					} else {
						g_KLine.JSChart.ChangePeriod(period);
					}
				}
			},
			NetworkFilter(data, callback) //第3方数据替换接口
			{
				+ -console.log(data.Name)
				switch (data.Name) {
					case 'KLineChartContainer::ReqeustHistoryMinuteData': //分钟全量数据下载
						this.ReqeustHistoryMinuteData(data, callback);
						break;
					case 'KLineChartContainer::RequestHistoryData': //日线全量数据下载
						this.RequestHistoryData(data, callback);
						break;
					case 'KLineChartContainer::RequestMinuteRealtimeData': //分钟实时数据更新
						this.RequestMinuteRealtimeData(data, callback);
						break;
					case 'KLineChartContainer::RequestRealtimeData': //日线实时数据更新
						this.RequestRealtimeData(data, callback);
						break;
				}
			},

			RecvMinuteHistoryData(recvData, callback, stockData, option) {
				// //console.log('[BitKLine::RecvMinuteHistoryData]', recvData);
				var klineData = this.JsonToHQChartMinuteHistoryData(recvData);

				var hqChartData = {
					code: 0,
					data: klineData
				};
				hqChartData.symbol = stockData.Symbol;
				hqChartData.name = stockData.Name;
				stockData.Chart.PageSize = 45; //设置一屏显示数据个数

				// #ifndef H5
				callback({
					data: hqChartData
				});
				// #endif
			},


			ReqeustHistoryMinuteData(data, callback, option) //第3方分钟线历史数据请求
			{
				data.PreventDefault = true;
				var period = data.Self.Period; //获取周期
				var symbol = this.Symbol;
				var name = this.Name;
				var peirodMenu = this.GetPeriodInfo(period);
				let type = 1
				if (peirodMenu.Period == 6) {
					type = 3
				}
				if (peirodMenu.Period == 8) {
					type = 5
				}
				// K线图数据请求
				this.get('api/kLine', {
					page: this.currentpage,
					rowNum: this.rowNum,
					type: type
				}).then(res => {
					if (res.data.code == 200) {
						let recvData = res.data.res
						console.log(recvData, '分钟');
						this.lastPage = res.data.res.last_page
						// if (res.data.res.current_page == 1) {
						// 	this.last = recvData.data[recvData.data.length - 1].last
						// 	this.low = recvData.data[recvData.data.length - 1].low
						// 	this.high = recvData.data[recvData.data.length - 1].high
						// 	this.volume_24h = recvData.data[recvData.data.length - 1].volume_24h
						// 	this.openVal = recvData.data[recvData.data.length - 1].kaipan_price
						// 	this.closeVal = recvData.data[recvData.data.length - 1].shoupan_price
						// 	this.rate = recvData.data[recvData.data.length - 1].rate * 100
						// }
						this.RecvMinuteHistoryData(recvData, callback, {
							Name: name,
							Symbol: symbol,
							Chart: data.Self
						}, option);
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			RequestMinuteRealtimeData(data, callback) //第3方分钟实时数据更新请求
			{
				data.PreventDefault = true;
				var period = data.Self.Period; //获取周期
				var symbol = this.Symbol;
				var name = this.Name;
				var peirodMenu = this.GetPeriodInfo(period);
				console.log('分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟');
				let type = 1
				if (peirodMenu.Period == 6) {
					type = 3
				}
				if (peirodMenu.Period == 8) {
					type = 5
				}
				// K线图数据请求
				this.get('api/kLine', {
					page: this.currentpage,
					rowNum: this.rowNum,
					type: type
				}).then(res => {
					if (res.data.code == 200) {
						let recvData = res.data.res
						this.lastPage = res.data.res.last_page
						// if (res.data.res.current_page == 1) {
						// 	this.last = recvData.data[recvData.data.length - 1].last
						// 	this.low = recvData.data[recvData.data.length - 1].low
						// 	this.high = recvData.data[recvData.data.length - 1].high
						// 	this.volume_24h = recvData.data[recvData.data.length - 1].volume_24h
						// 	this.openVal = recvData.data[recvData.data.length - 1].kaipan_price
						// 	this.closeVal = recvData.data[recvData.data.length - 1].shoupan_price
						// 	this.rate = recvData.data[recvData.data.length - 1].rate * 100
						// }
						this.RecvMinuteHistoryData(recvData, callback, {
							Name: name,
							Symbol: symbol,
							Chart: data.Self
						}, option);
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			RequestHistoryData(data, callback) //第3方日线历史数据请求
			{
				data.PreventDefault = true;
				var period = data.Self.Period; //获取周期
				var symbol = this.Symbol;
				var name = this.Name;
				var peirodMenu = this.GetPeriodInfo(period);
				var type = peirodMenu.Type,
					min = peirodMenu.Min,
					count = 500;

				var startDateTime = yMdhms();
				var hash = sha256.create();
				hash.update(API_KEY + this.PairName + type + min + startDateTime + count + SECRET_KEY);
				var secretHash = hash.hex();
				// K线图数据请求
				this.get('api/kLine', {
					page: this.currentpage,
					rowNum: this.rowNum,
					type: 7,
				}).then(res => {
					if (res.data.code == 200) {
						let recvData = res.data.res
						console.log(recvData, '日');
						this.lastPage = res.data.res.last_page
						// if (res.data.res.current_page == 1) {
						// 	this.last = recvData.data[recvData.data.length - 1].last
						// 	this.low = recvData.data[recvData.data.length - 1].low
						// 	this.high = recvData.data[recvData.data.length - 1].high
						// 	this.volume_24h = recvData.data[recvData.data.length - 1].volume_24h
						// 	this.openVal = recvData.data[recvData.data.length - 1].kaipan_price
						// 	this.closeVal = recvData.data[recvData.data.length - 1].shoupan_price
						// 	this.rate = recvData.data[recvData.data.length - 1].rate * 100
						// }
						this.RecvHistoryData(recvData, callback, {
							Name: name,
							Symbol: symbol,
							Chart: data.Self
						});
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			RequestRealtimeData(data, callback) //第3方日线实时数据更新请求
			{
				data.PreventDefault = true;
				var period = data.Self.Period; //获取周期
				var symbol = this.Symbol;
				var name = this.Name;
				var peirodMenu = this.GetPeriodInfo(period)
				var type = peirodMenu.Type,
					min = peirodMenu.Min,
					count = 2; //取最新2条数据

				var startDateTime = yMdhms();
				var hash = sha256.create();
				hash.update(API_KEY + this.PairName + type + min + startDateTime + count + SECRET_KEY);
				var secretHash = hash.hex();
				console.log('天天天天天天天天天天天天天天天天天天天天');
				// K线图数据请求
				this.get('api/kLine', {
					page: this.currentpage,
					rowNum: this.rowNum
				}).then(res => {
					if (res.data.code == 200) {
						this.currentpage = this.currentpage + 1
						this.lastPage = res.data.res.last_page
						let recvData = res.data.res
						this.RecvRealtimeData(recvData.data, callback, {
							Name: name,
							Symbol: symbol
						});
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},


			RecvHistoryData(recvData, callback, stockData) {
				var klineData = this.JsonToHQChartHistoryData(recvData);

				var hqChartData = {
					code: 0,
					data: klineData
				};
				hqChartData.symbol = stockData.Symbol;
				hqChartData.name = stockData.Name;
				stockData.Chart.PageSize = 45; //设置一屏显示数据个数

				// #ifndef H5
				callback({
					data: hqChartData
				});
				// #endif
			},

			RecvMinuteRealtimeData(recvData, callback, stockData) {
				// //console.log('[BitKLine::RecvMinuteRealtimeData]', recvData);

				var klineData = this.JsonToHQChartMinuteHistoryData(recvData);

				var hqChartData = {
					code: 0,
					data: klineData,
					ver: 2.0
				}; //数字货币使用ver2.0数据格式
				hqChartData.symbol = stockData.Symbol;
				hqChartData.name = stockData.Name;

				// #ifndef H5
				callback({
					data: hqChartData
				});
				// #endif

			},

			RecvRealtimeData(recvData, callback, stockData) {
				var stockItem = this.JsonToHQChartRealtimeData(recvData);
				stockItem.symbol = stockData.Symbol;
				stockItem.name = stockData.Name;
				var hqChartData = {
					code: 0,
					stock: [stockItem]
				};
				// #ifndef H5
				callback({
					data: hqChartData
				});
				// #endif
			},
			timeCpd(data) {
				let date = new Date(Number(data) * 1000);
				var YY = date.getFullYear();
				var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
				var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
				var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
				var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				return YY + MM + DD + hh + mm + ss;
			},
			JsonToHQChartHistoryData(recvData) //日线历史数据转化为hqchart数据格式
			{
				var data = recvData.data;
				var yClose = null;
				var klineData = [];
				for (let i = 0; i < data.length; i++) {
					var strData = Number(this.timeCpd(data[i].add_time)) + '|' + data[i].kaipan_price + '|' + data[i].high + '|' +
						data[i].low + '|' + data[i].shoupan_price + '|' + data[i].vom_now
					var item = strData;
					console.log(item, '日线');
					var aryItem = item.split('|');
					var date = parseInt(aryItem[0] / 1000000);
					var time = parseInt(aryItem[0] % 1000000 / 100);
					var open = parseFloat(aryItem[1]);
					var high = parseFloat(aryItem[2]);
					var low = parseFloat(aryItem[3]);
					var close = parseFloat(aryItem[4]);
					var vol = parseFloat(aryItem[5]);
					klineData.push([date, yClose, open, high, low, close, vol, null, time]);
					yClose = close;
				}
				return klineData;
			},

			JsonToHQChartRealtimeData(recvData) //日线最新数据转化为hqchart数据格式
			{
				var stockData = {};
				var data = recvData;
				var yClose = null;
				for (let i = 0; i < data.length; i++) {
					var strData = Number(this.timeCpd(data[i].add_time)) + '|' + data[i].kaipan_price + '|' + data[i].high + '|' +
						data[i].low + '|' + data[i].shoupan_price + '|' + data[i].vom_now
					var item = strData;
					var aryItem = item.split('|');
					stockData.date = parseInt(aryItem[0] / 1000000);
					stockData.open = parseFloat(aryItem[1]);
					stockData.high = parseFloat(aryItem[2]);
					stockData.low = parseFloat(aryItem[3]);
					stockData.price = parseFloat(aryItem[4]); //收盘价
					stockData.vol = parseFloat(aryItem[5]);
					stockData.yclose = yClose;
					stockData.amount = null;

					yClose = stockData.price;
				}

				return stockData;
			},


			JsonToHQChartMinuteHistoryData(recvData) //分钟（历史/最新）数据转化为hqchart数据格式
			{
				var data = recvData.data;
				var yClose = null;
				var klineData = [];
				for (let i = 0; i < data.length; i++) {
					var strData = Number(this.timeCpd(data[i].add_time)) + '|' + data[i].kaipan_price + '|' + data[i].high + '|' +
						data[i].low + '|' + data[i].shoupan_price + '|' + data[i].vom_now
					var item = strData;
					console.log(item, '分钟');
					var aryItem = item.split('|');
					var date = parseInt(aryItem[0] / 1000000);
					var time = parseInt(aryItem[0] % 1000000 / 100);
					var open = parseFloat(aryItem[1]);
					var high = parseFloat(aryItem[2]);
					var low = parseFloat(aryItem[3]);
					var close = parseFloat(aryItem[4]);
					var vol = parseFloat(aryItem[5]);
					klineData.push([date, yClose, open, high, low, close, vol, null, time]);
					yClose = close;
				}

				return klineData;
			},
			///////////////////////////////////////////////
			//手势事件 app/小程序才有
			//KLine事件
			KLineTouchStart: function(event) {
				if (g_KLine.JSChart) g_KLine.JSChart.OnTouchStart(event);
			},

			KLineTouchMove: function(event) {
				if (g_KLine.JSChart) g_KLine.JSChart.OnTouchMove(event);
			},

			KLineTouchEnd: function(event) {
				if (g_KLine.JSChart) g_KLine.JSChart.OnTouchEnd(event);
			},

			ChangeSize: function() {

				// #ifndef H5
				this.ChangeSize_app();
				// #endif
			},

			ChangeSize_app: function() {
				//修改画布的大小
				this.ChartWidth = 350;
				this.ChartHeight = 550;

				if (g_Minute.JSChart) {
					//修改插件大小
					g_Minute.JSChart.CanvasElement.Height = this.ChartHeight;
					g_Minute.JSChart.CanvasElement.Width = this.ChartWidth;
					g_Minute.JSChart.OnSize(); //重新绘制
				}

				if (g_KLine.JSChart) {
					//修改插件大小
					g_KLine.JSChart.CanvasElement.Height = this.ChartHeight;
					g_KLine.JSChart.CanvasElement.Width = this.ChartWidth;
					g_KLine.JSChart.OnSize(); //重新绘制
				}
			},

			ChangeSize_h5: function() {},

			touchCandle(e) {
				canvaCandle.scrollStart(e);
			},
			moveCandle(e) {
				canvaCandle.scroll(e);
			},
			touchEndCandle(e) {
				canvaCandle.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaCandle.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			tapButton(type) {
				let step = 5;
				if (type == 'in') {
					_this.itemCount -= step;
					if (_this.itemCount <= 5) {
						_this.itemCount = 5;
					}
				} else {
					_this.itemCount += step;
					if (_this.itemCount >= _this.sliderMax) {
						_this.itemCount = _this.sliderMax;
					}
				}
				_this.zoomCandle(_this.itemCount);
			},
			sliderMove(e) {
				_this.itemCount = e.detail.value;
				_this.zoomCandle(e.detail.value);
			},
			zoomCandle(val) {
				canvaCandle.zoom({
					itemCount: val
				});
			}
		}
	}
</script>
<style>
	page {
		background-image: url(~@/static/bg.png);
		background-size: 100% 100%;
	}
</style>
<style lang="scss" scoped>
	$col:#FF2C2C;

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

	.fx {
		display: flex;
		flex-direction: row;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: transparent;
	}

	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: transparent;
	}

	.qiun-textarea {
		height: 300upx;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.content {
		height: 95%;
		box-sizing: border-box;
		padding-top: 30rpx;

		.headTop {
			position: fixed;
			top: 0;
			width: 100%;
			height: calc(var(--status-bar-height) + 100rpx);
			padding-top: calc(var(--status-bar-height) + 50rpx);
			padding-left: 30rpx;
			padding-bottom: 40rpx;
			padding-right: 28rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 10;
			background: #0d1424;

			.headTopTitle {
				display: flex;
				align-items: center;
			}

			.release {
				justify-content: center;
				align-items: center;

				.icon1 {
					width: 44rpx;
					height: 48rpx;
				}

				text {
					display: block;
					margin-left: 15rpx;
					font-size: 28rpx;
					color: #3CF8FF;
				}
			}
		}

		.logoIcon {
			width: 40rpx;
			height: 40rpx;
		}

		.logoTxt {
			font-size: 35rpx;
			@include colF();
			font-size: 35rpx;
			font-weight: bold;
		}

		.titles {
			display: block;
			@include font40();
			@include colF();
			font-weight: bold;
			text-align: center;
		}

		// 价格高低
		.priceFluBox {
			@include flexBet();
			margin: 50rpx 30rpx 32rpx 30rpx;

			.price1 {
				@include font60();
				color: $col;
				font-weight: bold;
			}

			.price2 {
				@include font24();
				color: #a5a5a5;
				margin-top: 28rpx;
			}

			.rateTxt {
				color: $col;
				margin-left: 20rpx;
			}

			.itemFlex {
				min-width: 140rpx;
				margin-top: 14rpx;
				display: flex;
			}

			.priceTxt {
				@include font24();
				@include mainCol();
				// text-align: left;
			}

			.priceTxt2 {
				@include font24();
				@include colF();
				margin-left: 36rpx;
			}
		}


		.tabsBox {
			flex-shrink: 0;
			margin-top: 6rpx;
			justify-content: space-around;
			align-items: center;
			background-color: #141e31;

			.activeTab {
				text {
					color: #1667d2 !important;
				}
			}

			.tabsItem {
				text-align: center;
				flex: 1;
				padding: 25rpx 0 22rpx 0;

				text {
					display: block;
					font-size: 24rpx;
					color: #FFFFFF;
					transition: .3s;
				}
			}
		}

		.tabsBox2 {
			flex-shrink: 0;
			padding: 30rpx 0 30rpx 0;
			justify-content: space-around;
			align-items: center;
			background: linear-gradient(to bottom, #213554, #0B172A);

			.activeTab2 {
				text {
					color: #3CF8FF !important;
				}
			}

			.tabsItem2 {
				text-align: center;
				flex: 1;

				text {
					display: block;
					font-size: 30rpx;
					color: #FFFFFF;
					transition: .3s;
				}
			}
		}

		.moveBorder {
			line-height: 0;
			height: 6rpx;
			background-color: #141e31;

			.moveBorderImg {
				position: relative;
				display: block;
				height: 6rpx;
				background-color: #1667d2;
				transition: .3s;
			}
		}

		.moveBorder2 {
			line-height: 0;
			height: 2rpx;
			background-color: #141e31;

			.moveBorderImg2 {
				position: relative;
				display: block;
				height: 1rpx;
				background-color: #1667d2;
				transition: .3s;
			}
		}

		.listBox {
			min-height: 500rpx;
			margin-bottom: 10rpx;

			.listSwiperItem {
				display: flex;
				flex-direction: column;
				background-color: #0D1522;
				height: 100%;

				.listScroll {
					flex: 1;
					min-height: 200rpx;
				}
			}
		}

		.titleBtm {
			justify-content: space-around;
			text-align: center;

			.cloum {
				flex: 1;

				.title {
					display: block;
					color: #999999;
					font-size: 20rpx;
					margin: 30rpx 0 32rpx 0;
				}

				.titleLeft {
					text-align: left;
					padding-left: 16rpx;
				}

				.titleRight {
					text-align: right;
					padding-right: 16rpx;
				}

				.contentData {
					justify-content: space-around;
				}

				.contentData,
				.contentDataStart,
				.contentDataEnd {
					padding-bottom: 20rpx;

					text {
						display: block;
						font-size: 22rpx;
						color: #FFFFFF;
					}

					.textLeft,
					.textRight {
						display: block;
						text-align: center;
						width: 30rpx;
					}

					.textLeft {
						margin: 0 16rpx 0 20rpx;
					}

					.textRight {
						margin: 0 20rpx 0 16rpx;
					}
				}

				.contentDataStart {
					justify-content: flex-start;
				}

				.contentDataEnd {
					justify-content: flex-end;
				}
			}
		}

		.idtTitle {
			display: block;
			color: #FFFFFF;
			font-size: 30rpx;
		}

		.idtItem {
			justify-content: space-between;
			font-size: 22rpx;
			margin: 30rpx 0;

			.label {
				color: #999999;
			}

			.value {
				color: #FFFFFF;
			}
		}

		.idtContent {
			display: block;
			color: #999999;
			font-size: 18rpx;
			text-indent: 30rpx;
			line-height: 30rpx;
		}

		.titles {
			@include font40();
			@include colF();
			font-weight: bold;
			text-align: center;
		}
	}
</style>
