<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.CustomerService">
			<image slot="rightBox" class="icon11" src="~@/static/index/icon11.png" @tap="goTo('questionList/questionList')"></image>
		</tab-top>
		<view class="content">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view class="itemBox" @tap="viewDes(index)" v-for="(item,index) in lists" :key="index">
					<view class="items">
						<view class="itemLeft">
							<image src="~@/static/me/icon10.png" class="icon12"></image>
							<text class="itemTxt">{{item.title}}</text>
						</view>
						<text class="nextIcon" :class="{'viewIcon':desShow==index}"></text>
					</view>
					<view class="des" v-show="desShow==index">{{item.content}}</view>
				</view>
				<view class="tipTxt" v-if="lists.length==0">
					<text>{{languageInfo.noData}}</text>
				</view>
				<view class="loading-text" v-if="loadingText==1 && lists.length>0">{{languageInfo.scrollTaps}}</view>
			</scroll-view>
		</view>
		<!-- 按钮 -->
		<view>
			<button class="btn" hover-class="nont" @tap="goTo('feedBack/feedBack')">{{languageInfo.HumanServices}}</button>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	var _this;
	export default {
		data() {
			return {
				desShow: -1,
				lists: [],
				page: 1,
				rowNum: 15,
				total: 0,
				lastPage: 0,
				languageInfo: {},
				loadingText: 0

			}
		},
		components: {
			tabTop
		},
		onLoad() {
			_this = this
		},
		onShow() {
			_this.getQuestList()
			_this.languageInfo = this.linkTo.showLanguage()
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.lists = [];
			_this.total = [];
			_this.getQuestList()
		},
		onReachBottom() {
			let arr = _this.lists.length
			let total = _this.total
			if (arr < total) {
				_this.getmore()
			}
		},
		methods: {
			// 跳转
			goTo(url) {
				_this.linkTo.navTo(url)
			},
			// 查看详情
			viewDes(index) {
				let des = _this.desShow
				_this.desShow = index
				if (des == index) {
					_this.desShow = -1
				}
			},
			// 问题列表
			getQuestList() {
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/questionList', data).then(res => {
					if (res.data.res.data.length > 0) {
						_this.lists = res.data.res.data
						_this.total = res.data.res.total
						_this.lastPage = res.data.res.last_page
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
				_this.get('api/questionList', data).then(res => {
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

		.icon11 {
			width: 44rpx;
			height: 48rpx;
		}
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

				.viewIcon {
					transform: rotate(130deg);
					transition: ease-in-out .3s;
				}
			}

			.des {
				@include font20();
				@include colF();
				margin: 20rpx 16rpx 0 46rpx;
				line-height: 32rpx;
			}
		}
	}
</style>
