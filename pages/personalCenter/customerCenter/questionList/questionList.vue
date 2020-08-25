<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.feedbackRecord"></tab-top>
		<view class="content">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view class="itemBox" v-for="(item,index) in lists" :key="index">
					<view class="items">
						<view class="itemLeft">
							<image src="~@/static/me/icon10.png" class="icon12"></image>
							<text class="itemTxt">{{item.content}}</text>
						</view>
						<!-- <text class="nextIcon"></text> -->
					</view>
					<view class="des">{{item.answer}}</view>
					<view class="des yet" v-if="item.answer==''">{{languageInfo.NoReplyYet}}</view>
				</view>
				<view class="tipTxt" v-if="lists.length==0">
					<text>{{languageInfo.noData}}</text>
				</view>
				<view class="loading-text" v-if="loadingText==1 && lists.length>0">{{languageInfo.scrollTaps}}</view>
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
				languageInfo: {},
				lists:[],
				page: 0,
				rowNum: 15,
				loadingText:0
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
			getList() {
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/feedbackList', data).then(res => {
					let datas = res.data.res.data
					if (datas.length > 0) {
						_this.lists = datas
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
				_this.get('api/feedbackList', data).then(res => {
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
		padding: 0 20rpx;
		box-sizing: border-box;

		.scrollHeight {
			width: 100%;
			height: calc(100vh - 320rpx);
		}

		.itemBox {
			@include borCol();
			padding: 30rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin-bottom: 10rpx;

			.items {
				@include flexBet();

				.icon12 {
					width: 30rpx;
					height: 30rpx;
				}

				.itemLeft {
					display: flex;
				}
				.itemTxt {
					@include font24();
					@include mainCol();
					margin-left: 12rpx;
					line-height: 30rpx;
				}

				.nextIcon {
					border-top: 2rpx solid #3CF8FF;
					border-right: 2rpx solid #3CF8FF;
					transition: ease-in-out .3s;
				}
			}

			.des {
				@include font20();
				@include colF();
				margin: 20rpx 16rpx 0 46rpx;
				line-height: 32rpx;
			}
			.yet{
				@include colA();
			}
		}
	}
</style>
