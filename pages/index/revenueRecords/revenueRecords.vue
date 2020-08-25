<template>
	<view class="containerBox">
		<tab-top left-icon='back' :title="languageInfo.revenueRecord"></tab-top>
		<view class="content">
			<!-- tab -->
			<view class="navBar">
				<view class="navItem" :class="{'selectOn':currentIndex==1}" @tap="changeTab(2)">
					<text>USDT{{languageInfo.recording}}</text>
					<image v-show="currentIndex==2" class="navBom" src="~@/static/index/bor-bom.png"></image>
				</view>
				<view class="navItem" @tap="changeTab(1)">
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
								<text class="txt1">{{item.content}}</text>
								<text class="txt2" v-if="item.type=='1'">+{{item.money}}</text>
								<text class="txt2" v-else>-{{item.money}}</text>
							</view>
							<view class="timeTxt">{{item.add_time}}</view>
						</view>
					</view>
				</view>
				<view class="tipTxt" v-show="lists.length==0">{{languageInfo.noData}}</view>
				<view class="loading-text" v-if="loadingText==1">{{languageInfo.scrollTaps}}</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	var _this;
	export default {
		data() {
			return {
				currentIndex: 2,
				page: 1,
				rowNum: 15,
				total: 0,
				lists: [],
				loadingText: 0,
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
			_this.languageInfo = this.linkTo.showLanguage()
			_this.getList()
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.lists = [];
			_this.total = [];
			_this.getList()
		},
		onReachBottom() {
			let arr = _this.lists.length
			let total = _this.total
			if (arr < total) {
				_this.getmore()
			}
		},
		methods: {
			// tab切换
			changeTab(index) {
				_this.currentIndex = index
				_this.page = 1
				_this.getList()
			},
			getList() {
				_this.loadingText = 0
				uni.showNavigationBarLoading()
				let data = {
					currency_id: _this.currentIndex,
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/earningsList', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.lists=[]
					}else{
						_this.lists = res.data.res.data
						_this.total = res.data.res.total
					}
					uni.hideNavigationBarLoading(); //关闭加载动画
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
				})
			},
			// 上拉加载// 上拉加载
			getmore() {
				let page = _this.page
				page++
				uni.showNavigationBarLoading(); //显示加载动画
				let data = {
					currency_id: _this.currentIndex,
					page: page,
					rowNum: _this.rowNum
				}
				_this.get('api/earningsList', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.loadingText = 1
						uni.hideNavigationBarLoading(); //关闭加载动画
						return;
					} else {
						_this.page++
						_this.lists = _this.lists.concat(res.data.res.data); //将数据拼接在一起
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.containerBox {
		@include bg();
		box-sizing: border-box;
		height: 100%;
	}

	.content {
		padding-top: 20rpx;
		.scrollHeight {
			width: 100%;
			height: calc(100vh - 200rpx);
		}

		.navBar {
			position: fixed;
			left: 0;
			right: 0;
			@include cen();
			height: 68rpx;
			z-index: 999;
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
			padding: 90rpx 30rpx 0 30rpx;
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
