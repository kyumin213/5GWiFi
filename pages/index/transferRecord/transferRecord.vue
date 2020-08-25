<template>
	<view class="containerBox">
		<tab-top left-icon='back' :title="languageInfo.transferRecords"></tab-top>
		<view class="content">
			<!-- tab -->
			<view class="navBar">
				<view class="navItem" :class="{'selectOn':currentIndex==2}" @tap="changeTab(2)">
					<text>USDT{{languageInfo.recording}}</text>
					<image v-show="currentIndex==2" class="navBom" src="~@/static/index/bor-bom.png"></image>
				</view>
				<view class="navItem" :class="{'selectOn':currentIndex==1}" @tap="changeTab(1)">
					<text>WiFi{{languageInfo.recording}}</text>
					<image v-show="currentIndex==1" class="navBom" src="~@/static/index/bor-bom.png"></image>
				</view>
			</view>
			<!-- 内容 -->
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view class="tabCon">
					<view class="tabOne">
						<view class="conItem" v-for="(item,index) in lists" :key="index">
							<view class="itemTop">
								<text class="txt1">{{languageInfo.successfulTransfer}}</text>
								<text class="txt2">+{{item.num}}</text>
							</view>
							<view class="timeTxt">{{item.create_time}}</view>
						</view>
					</view>
				</view>
				<view class="tipTxt" v-show="lists.length==0">
					{{languageInfo.noData}}
				</view>
				<view class="loading-text" v-if="loadingText==1&&lists.length>0">{{languageInfo.scrollTaps}}</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	var _this;
	export default {
		data() {
			return {
				currentIndex: 2,
				currencyId: 1, //转账类型
				page: 1,
				rowNum: 15,
				total: 0,
				lists: [],
				loadingText: 0,
				currentPage: 0,
				languageInfo: {}

			}
		},
		components: {
			tabTop
		},
		onLoad() {
			_this = this
		},
		onShow() {
			_this.languageInfo = _this.linkTo.showLanguage()
			_this.getRecord()
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.lists = [];
			_this.total = [];
			_this.getRecord()
		},
		onReachBottom() {
			let currentPage = _this.currentPage
			let page = _this.page
			let total = _this.total
			if (currentPage > page) {
				_this.getmore()
			} else {
				return
			}
		},
		methods: {
			// tab切换
			changeTab(index) {
				_this.currentIndex = index
				_this.page = 1
				_this.getRecord()
			},
			// USDT转账记录
			getRecord() {
				_this.loadingText = 0
				uni.showNavigationBarLoading(); //显示加载动画
				let data = {
					currency_id: _this.currentIndex,
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/transferList', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.lists = []
					} else {
						_this.lists = res.data.res.data
						_this.total = res.data.res.total
						_this.currentPage = res.data.res.last_page
					}
					uni.hideNavigationBarLoading(); //关闭加载动画
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
				})
			},
			// 上拉加载// 上拉加载
			getmore() {
				let page = _this.page
				let currPage = _this.currentPage
				console.log(currPage)
				page++
				uni.showNavigationBarLoading(); //显示加载动画
				let data = {
					currency_id: _this.currentIndex,
					page: page,
					rowNum: _this.rowNum
				}
				_this.get('api/transferList', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.loadingText = 1
						uni.hideNavigationBarLoading(); //关闭加载动画
						return;
					} else {
						_this.page++
						_this.lists = _this.lists.concat(res.data.res.data); //将数据拼接在一起
						uni.hideNavigationBarLoading(); //关闭加载动画
						uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
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
	.containerBox {
		@include bg();
		height: 100%;
		padding-top: 60rpx;
		box-sizing: border-box;
	}

	.content {
		padding-top: 20rpx;
		box-sizing: border-box;

		.scrollHeight {
			width: 100%;
			height: calc(100vh - 250rpx);
		}

		.navBar {
			position: fixed;
			top: 140rpx;
			left: 0;
			right: 0;
			@include cen();
			height: 68rpx;
			background: linear-gradient(to top, #0B172A, #213554);

			.navItem {
				width: 50%;
				@include font24();
				@include colF();
				text-align: center;
				height: 68rpx;
				line-height: 68rpx;
				position: relative;

				.navBom {
					position: absolute;
					bottom: -2rpx;
					left: 0;
					width: 100%;
					height: 2rpx;
				}
			}

			.selectOn {
				@include mainCol();
			}
		}

		// 内容
		.tabCon {
			// padding-top: 30rpx;
			margin: 20rpx 30rpx;
			box-sizing: border-box;

			.conItem {
				@include borCol();
				height: 120rpx;
				border-radius: 10rpx;
				padding: 26rpx 40rpx;
				box-sizing: border-box;
				margin-bottom: 10rpx;

				.itemTop {
					@include flexBet();
				}

				.txt1,
				.txt2 {
					@include font30();
					@include mainCol();
				}

				.txt2 {
					font-weight: bold;
				}

				.timeTxt {
					@include colA();
					@include font20();
					margin-top: 14rpx;
				}
			}
		}
	}
</style>
