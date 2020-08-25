<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.systemNotification"></tab-top>
		<view class="listBox">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view class="listItem" @tap="notificationDetails(index)" v-for="(item,index) in lists" :key="index">
					<text class="itemTime">{{item.create_time}}</text>
					<view class="itemTitle">
						<view class="itemLeft">
							<image class="icons" src="~@/static/me/iconMeg.png"></image>
							<text class="listTxt">{{item.title}}</text>
						</view>
						<text class="nextIcon"></text>
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
				languageInfo: {},
				page: 1,
				rowNum: 15,
				total: 0,
				loadingText: 0,
				lists: []
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
			// 公告列表
			getList() {
				_this.page = 1
				_this.loadingText = 0
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/systemNotice', data).then(res => {
					if (res.data.res.data.length > 0) {
						_this.lists = res.data.res.data
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
				_this.get('api/systemNotice', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.loadingText = 1
						uni.hideNavigationBarLoading(); //关闭加载动画
						return;
					} else {
						_this.page++
						let datas = res.data.res.data
						_this.lists = _this.lists.concat(datas); //将数据拼接在一起
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				})
			},
			// 详情页
			notificationDetails(index) {
				let con = _this.lists[index].content
				let tit = _this.lists[index].title
				let times = _this.lists[index].create_time
				uni.navigateTo({
					url: 'notificationDetails/notificationDetails?title='+tit+'&content='+con+'&time='+times
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.p{
		line-height: 48rpx;
	}
	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;

		.listBox {
			margin:0 20rpx;
			.scrollHeight{
				width: 100%;
				height: calc(100vh - 180rpx);
			}
			.listItem {
				margin-bottom: 40rpx;
			}

			.itemTime {
				display: inline-block;
				padding-bottom: 28rpx;
				@include colA();
				@include font24();
				width: 100%;
				text-align: center;

			}

			.itemTitle {
				@include borCol();
				@include flexBet();
				border-radius: 10rpx;
				width: 100%;
				padding: 30rpx;
				box-sizing: border-box;

				.itemLeft {
					display: flex;
				}

				.listTxt {
					@include mainCol();
					@include font24();
					margin-left: 12rpx;
					word-break:break-all;
					word-wrap:break-word; 
				}

				.icons {
					width: 30rpx;
					height: 30rpx;
				}

				.nextIcon {
					border-top: 2rpx solid #3CF8FF;
					border-right: 2rpx solid #3CF8FF;
				}
			}

		}
	}
</style>
