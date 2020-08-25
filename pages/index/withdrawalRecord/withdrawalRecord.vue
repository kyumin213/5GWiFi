<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="'USDT'+languageInfo.withdrawalsRecord"></tab-top>
		<view class="content">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view>
					<view class="items" v-for="(item,index) in lists" :key="index">
						<view class="itemTop">
							<text class="txt1">USDT</text>
							<text class="txt1">{{item.actual}}</text>
						</view>
						<view class="timeTxt">
							<text>{{item.create_time}}</text>
							<text v-if="item.status=='1'">{{languageInfo.underReview}}</text>
							<text v-if="item.status=='2'">{{languageInfo.pendingCoins}}</text>
							<text v-if="item.status=='3'">{{languageInfo.successfulWithdrawal}}</text>
							<text v-if="item.status=='4'">{{languageInfo.withdrawalFailed}}</text>
						</view>
						<view v-if="item.status=='3'">
							<view>
								<text class="txt2">TXID:</text>
								<text class="idTxt">
									{{item.url}}
								</text>
							</view>
							<view class="btnBox">
								<text class="copyBtn" @tap="copyKey(item.url)">{{languageInfo.copy}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="tipTxt" v-if="lists.length==0">
					<text>{{languageInfo.noData}}</text>
				</view>
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
				lists: [],
				page: 1,
				rowNum: 15,
				total:0,
				loadingText:0,
				languageInfo:{}
			}
		},
		components: {
			tabTop
		},
		onLoad(){
			_this = this
		},
		onShow() {
			_this.getFetchList()
			_this.languageInfo = _this.linkTo.showLanguage()
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.lists = [];
			_this.total = [];
			_this.getFetchList()
		},
		onReachBottom() {
			let arr = _this.lists.length
			let total = _this.total
			if (arr < total) {
				_this.getmore()
			}
		},
		methods: {
			// 提现记录
			getFetchList() {
				uni.showNavigationBarLoading(); //显示加载动画
				_this.page = 1
				_this.loadingText= 0
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/fetchList', data).then(res => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					_this.lists = res.data.res.data
					_this.total = res.data.res.total
				})
			},
			// 上拉加载// 上拉加载
			getmore() {
				let page = _this.page
				page++
				uni.showNavigationBarLoading(); //显示加载动画
				let data = {
					page: page,
					rowNum: _this.rowNum
				}
				_this.get('api/fetchList', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.loadingText=1
						uni.hideNavigationBarLoading(); //关闭加载动画
						return;
					} else {
						_this.page++
						_this.lists = _this.lists.concat(res.data.res.data); //将数据拼接在一起
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				})
			},
			// 复制
			copyKey(value) {
				uni.setClipboardData({
					data: value, // 要复制的文字
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								uni.showToast({
									icon: 'success'
								});
							}
						});
					}
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	.containerBox {
		@include bg();
		height: 100%;
	}

	.content {
		padding: 0 30rpx;
		box-sizing: border-box;

		.scrollHeight {
			width: 100%;
			height: calc(100vh - 150rpx);
		}

		.items {
			@include borCol();
			padding: 30rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin-bottom: 10rpx;

			.itemTop {
				@include flexBet();

				.txt1 {
					@include font30();
					@include mainCol();
				}
			}

			.timeTxt {
				@include font20();
				@include flexBet();
				color: #aaa;
				margin-top: 10rpx;
			}

			.txt2 {
				@include colF();
				@include font24();
			}

			.idTxt {
				@include font20();
				@include mainCol();
				word-wrap: break-word;
				word-break: normal;
			}

			.btnBox {
				width: 100%;
				display: flex;
				justify-content: flex-end;

				.copyBtn {
					@include borCol();
					@include font20();
					@include mainCol();
					height: 36rpx;
					line-height: 36rpx;
					padding: 0 16rpx;
					border-radius: 4rpx;
				}
			}
		}
	}
</style>
