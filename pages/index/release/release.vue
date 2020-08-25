<template>
	<view class="containerBox">
		<tab-top left-icon='back' :title="languageInfo.wifiFreed"></tab-top>
		<view class="content">
			<view class="imgBox">
				<view>
					<image src="../../../static/index/releaseBg.png" class="releaseIcon"></image>
					<view class="txt1Box">
						<text class="txt2">{{languageInfo.totalAmount}}</text>
						<view class="txt3">{{leaveNum}}</view>
					</view>
					<view class="txt2Box">
						<text class="txt4">{{languageInfo.releasedCumulatively}}</text>
						<view class="txt5">{{releaseNum}}</view>
					</view>
				</view>
			</view>
			<!-- 释放记录 -->

			<view class="listBox">
				<view class="itemTitle">{{languageInfo.releaseRecord}}</view>
				<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
					<view class="isNull" v-if="isNull">{{languageInfo.noData}}</view>
					<view class="listItem" v-for="(item,index) in lists" :key="index">
						<text class="timeTxt">{{item.sf_time}}</text>
						<view class="itemRight">
							<text class="numTxt">{{item.num}}</text>
							<text class="nameTxt">WiFi</text>
						</view>
					</view>
					<view class="tipTxt" v-show="lists.length==0">
						{{languageInfo.noData}}
					</view>
					<view class="loading-text" v-if="loadingText==1&&lists.length>0">{{languageInfo.scrollTaps}}</view>
				</scroll-view>
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
				isNull: false,
				leaveNum: 0, //待释放总量
				releaseNum: 0, //已释放总量
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
			_this.getNum()
			_this.getRelease()
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.lists = [];
			_this.total = [];
			_this.getRelease()
		},
		onReachBottom() {
			let arr = _this.lists.length
			let total = _this.total
			if (arr < total) {
				_this.getmore()
			}
		},
		methods: {
			// 释放数量、已释放数量
			getNum() {
				_this.get('api/releaseInfo').then(res => {
					_this.leaveNum = res.data.res.leave_num
					_this.releaseNum = res.data.res.release_num
				})
			},
			// 释放记录
			getRelease() {
				_this.loadingText = 0
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/releaseList', data).then(res => {
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
				_this.get('api/releaseList', data).then(res => {
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
			},
		}
	}
</script>
<style lang="scss" scoped>
	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}

	.content {
		height: 100%;
		padding: 30rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;

		.scrollHeight {
			width: 100%;
			height: calc(100vh - 740rpx);
			box-sizing: border-box;
		}

		.imgBox {
			@include cen();
			position: relative;
		}

		.releaseIcon {
			width: 528rpx;
			height: 390rpx;
		}

		.txt1Box {
			position: absolute;
			top: 0;
			left: 40rpx;

			.txt2 {
				@include colF();
				@include font28();
			}

			.txt3 {
				font-size: 35rpx;
				@include mainCol();
				font-weight: bold;
				padding-top: 10rpx;
			}
		}

		.txt2Box {
			position: absolute;
			bottom: 40rpx;
			left: 40rpx;

			.txt4 {
				@include font20();
				@include colF();
			}

			.txt5 {
				@include font22();
				@include mainCol();
				margin-top: 8rpx;
			}
		}

		// 记录
		.listBox {
			@include borCol();
			border-radius: 6rpx;
			margin-top: 60rpx;
			margin-bottom: 30rpx;
			box-sizing: border-box;

			.itemTitle {
				@include mainCol();
				@include font26();
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border-bottom: 2rpx solid #3CF8FF;
			}

			.isNull {
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				@include font24();
				@include colA();
			}

			.listItem {
				@include flexBet();
				height: 90rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #3CF8FF;
				.itemRight{
					display: flex;
					justify-content: flex-end;
					align-items: center;
				}
				.timeTxt {
					@include mainCol();
					@include font24();
				}

				.numTxt {
					@include font24();
					@include colF();
				}

				.nameTxt {
					@include font24();
					@include mainCol();
					margin-left: 8rpx;
				}
			}

			.listItem:last-child {
				border-bottom: none;
			}
		}
	}
</style>
