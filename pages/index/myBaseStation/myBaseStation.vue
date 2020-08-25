<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.myBaseStation"></tab-top>
		<view class="content">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view class="itemBox" v-for="(item,index) in lists" :key="index">
					<view>
						<view>
							<text class="txt1 mr10">{{languageInfo.BaseStationLevel}}:</text>
							<text class="txt2">{{item.base_station.base_name}}</text>
						</view>
						<view class="item1">
							<text class="txt1 mr10">{{languageInfo.startTime}}:</text>
							<text class="txt2">{{item.create_time}}</text>
						</view>
						<view class="item1">
							<text class="txt1 mr10">{{languageInfo.releaseFactor}}:</text>
							<text class="txt2">{{item.sf_column*100}}%</text>
						</view>
						<view class="item1" v-if="item.remaining_num>0">
							<text class="txt1 mr10">{{languageInfo.remainingAmount}}:</text>
							<text class="txt2">{{item.remaining_num}}个</text>
						</view>
						<view class="progressBox">
							<text class="proTxt mr10">{{languageInfo.progress}}:</text>
							<view class="progress-box">
								<progress :percent="item.percent" activeColor="#3CF8FF" backgroundColor="transparent" active stroke-width="8" />
							</view>
							<text class="proTxt">{{item.percent}}%</text>
						</view>
					</view>
				</view>
				<view class="tipTxt" v-if="lists.length==0">
					<text>{{languageInfo.noData}}</text>
				</view>
				<view class="loading-text" v-if="loadingText==1&&lists.length>0">{{languageInfo.scrollTaps}}</view>
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
				percent: 20,
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
			_this.languageInfo = _this.linkTo.showLanguage();
			_this.getBaseStation()
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.lists = [];
			_this.total = [];
			_this.getBaseStation()
		},
		onReachBottom() {
			let arr = _this.lists.length
			let total = _this.total
			if (arr < total) {
				_this.getmore()
			}
		},
		methods: {
			// 初始化
			getBaseStation() {
				_this.loadingText = 0
				_this.page = 1
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/myMillList', data).then(res => {
					if (res.data.res.data.length > 0) {
						_this.lists = res.data.res.data
						_this.total = res.data.res.total
						let datas = res.data.res.data
						for (let i in datas) {
							if (parseFloat(datas[i].wifi_num) == 0 && datas[i].status == '1') {
								_this.lists[i].percent = 0
							} else if (datas[i].status == '2') {
								_this.lists[i].percent = parseFloat((parseFloat(datas[i].wifi_num) - parseFloat(datas[i].remaining_num)) /parseFloat(datas[i].wifi_num)).toFixed(2)*100
							} else if (datas[i].status == '3') {
								_this.lists[i].percent = 100
							}
						}
					}

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
				_this.get('api/myMillList', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.loadingText = 1
						uni.hideNavigationBarLoading(); //关闭加载动画
						return;
					} else {
						_this.page++
						let datas = res.data.res.data
						_this.lists = _this.lists.concat(datas); //将数据拼接在一起
						for (let i in _this.lists) {
							if (parseFloat(_this.lists[i].wifi_num) == 0 && _this.lists[i].status == '1') {
								_this.lists[i].percent = 0
							} else if (_this.lists[i].status == '2') {
								_this.lists[i].percent = parseFloat((parseFloat(_this.lists[i].wifi_num) - parseFloat(_this.lists[i].remaining_num)) /parseFloat(_this.lists[i].wifi_num)).toFixed(2)*100
							} else if (_this.lists[i].status == '3') {
								_this.lists[i].percent = 100
							}
						}
						uni.hideNavigationBarLoading(); //关闭加载动画
						return
					}
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	progress {
		border-radius: 8rpx;
		@include borCol();
	}

	.mr10 {
		margin-right: 10rpx;
	}

	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}

	.content {
		padding: 10rpx 0;
		margin: 0rpx 24rpx;
		box-sizing: border-box;

		.scrollHeight {
			width: 100%;
			height: calc(100vh - 140rpx);
		}

		.itemBox {
			background-image: url(~@/static/index/baseBg.png);
			background-size: 100% 100%;
			width: 100%;
			// height: 290rpx;
			display: flex;
			flex-direction: column;
			align-content: flex-start;
			padding: 30rpx 30rpx;
			box-sizing: border-box;

			.item1 {
				padding-top: 12rpx;
			}

			.txt1 {
				@include mainCol();
				@include font24();
				margin-top: 28rpx;
			}

			.txt2 {
				@include font24();
				@include colF();
			}

			.activeColor {
				background: linear-gradient(to left, #0C989E, #3CF8FF);
			}

			.progressBox {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-top: 22rpx;
				padding-bottom: 10rpx;
				box-sizing: border-box;

				.proTxt {
					@include mainCol();
					@include font24();
				}

				.progress-box {
					width: 360rpx;
					margin-right: 16rpx;
				}
			}
		}

	}
</style>
