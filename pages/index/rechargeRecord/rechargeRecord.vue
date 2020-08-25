<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="'USDT'+languageInfo.rechargeRecord"></tab-top>
		<view class="content">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view class="itemBox" v-for="(item,index) in lists" :key="index">
					<view class="itemTop">
						<text class="txt1">USDT</text>
						<text class="txt1">{{item.num}}</text>
					</view>
					<view class="timeTxt">
						<text>{{item.create_time}}</text>
					</view>
					<view>
						<text class="idTxt">
							{{item.tid}}
						</text>
					</view>
				</view>
				<view class="tipTxt" v-if="lists.length==0">{{languageInfo.noData}}</view>
				<view class="loading-text" v-if="loadingText==1">{{languageInfo.scrollTaps}}</view>
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
				page: 1, //页数	
				rowNum: 15, //每页条数
				lists:[],
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
			_this.getRechargeList()
			_this.languageInfo = _this.linkTo.showLanguage();
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.lists = [];
			_this.total = [];
			_this.getRechargeList()
		},
		onReachBottom() {
			let arr = _this.lists.length
			let total = _this.total
			if (arr < total) {
				_this.getmore()
			}
		},
		methods: {
			getRechargeList() {
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/rechargeList', data).then(res => {
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
				_this.get('api/rechargeList', data).then(res => {
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
<style>
/* 	page {
		background-image: url(~@/static/bg.png);
		background-size: 100% 100%;
	} */
</style>
<style lang="scss" scoped>
	.containerBox{
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}
	.content{
		padding:0 30rpx 30rpx 30rpx;
		box-sizing: border-box;
		.scrollHeight{
			width: 100%;
			height: calc(100vh - 170rpx);
		}
		.itemBox {
			@include borCol();
			border-radius: 10rpx;
			// height: 180rpx;
			padding: 30rpx 40rpx;
			box-sizing: border-box;
			margin-bottom: 10rpx;
		}

		.itemTop {
			@include flexBet();
			.txt1 {
				@include font30();
				@include mainCol();
			}
		}

		.timeTxt {
			@include font20();
			color: #aaa;
			margin-top: 10rpx;
		}

		.idTxt {
			display: block;
			@include font20();
			@include colF();
			word-wrap: break-word;
			word-break: normal;
			margin-top: 10rpx;
			line-height: 28rpx;
		}
	}
	.isNull {
		@include font24();
		@include colA();
		text-align: center;
		margin-top: 100rpx;
	}
</style>
