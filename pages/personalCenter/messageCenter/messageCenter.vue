<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.messageCenter"></tab-top>
		<view class="itemBox">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmorenews">
				<view class="items" v-for="(item,index) in lists" :key='index'>
					<view>
						<text class="leftTxt">{{languageInfo.fundPool}}</text>
						<text class="leftTime">{{item.create_time}}</text>
					</view>
					<view class="itemRight">
						<view>
							<text class="rightTxt" v-if="item.status=='2'">{{item.amount}}</text>
							<text class="rightTxt ml10" v-if="item.status=='2'">WiFi</text>
						</view>
						<view class="status" v-if="item.status=='2'">{{languageInfo.received}}</view>
						<view class="status receive" v-if="item.status=='1'" @tap="receiveMsg(index)">{{languageInfo.receive}}</view>
					</view>
				</view>
				<view class="loading-text" v-if="loadingText==1&&lists.length>0">{{languageInfo.scrollTaps}}</view>
				<view class="tipTxt" v-if="lists.length==0">{{languageInfo.noData}}</view>
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
				page: 1, //页码
				rowNum: 15, //每页条数
				total: 0, //总条数
				loadingText:0,
				lists: [],
				languageInfo: {}
			}
		},
		components: {
			tabTop
		},
		onLoad(){
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
				_this.getmorenews()
			}
		},
		methods: {
			showToast() {
				uni.showToast({
					title: _this.languageInfo.scrollTaps,
					icon: "none"
				})
			},
			// 获取消息列表
			getList() {
				uni.showNavigationBarLoading()
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/messageList', data).then(res => {
					_this.lists = res.data.res.data
					_this.total = res.data.res.total
					_this.loadingText = 0
					uni.hideNavigationBarLoading(); //关闭加载动画
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
				})
			},
			// 领取消息
			receiveMsg(e){
				let ids = _this.lists[e].id
				_this.get('api/getMessageAmount',{id:ids}).then(res=>{
					uni.showToast({
						icon:'success'
					})
					setTimeout(()=>{
						_this.getList()
					},1000)
				})
			},
			// 上拉加载// 上拉加载
			getmorenews() {
				let page = _this.page
				page++
				console.log(_this.page)
				uni.showNavigationBarLoading(); //显示加载动画
				let data = {
					page: page,
					rowNum: _this.rowNum
				}
				_this.get('api/messageList', data).then(res => {
					if (res.data.res.data.length == 0) {
						// _this.showToast()
						_this.loadingText=1
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
	.ml10{
		margin-left: 10rpx;
	}
	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}

	.itemBox {
		padding-top: 0;
		margin: 0 20rpx 20rpx 20rpx;

		.scrollHeight {
			width: 100%;
			height: calc(100vh - 50px - 40rpx);
			box-sizing: border-box;
			.loading-text {
				width: 100%;
				text-align: center;
				@include font24();
				color: #ccc;
				padding-top: 20rpx;
			}
		}

		.items {
			@include borCol();
			@include flexBet();
			border-radius: 10rpx;
			height: 130rpx;
			padding: 0 40rpx;
			margin-bottom: 10rpx;
		}

		.leftTxt {
			@include mainCol();
			@include font24();
		}

		.leftTime {
			display: block;
			@include col9();
			@include font24();
			margin-top: 10rpx;
		}

		.itemRight {
			text-align: right;
		}

		.rightTxt {
			@include font30();
			@include colF();
		}

		.status {
			@include col9();
			@include font24();
			margin-top: 10rpx;
		}

		.receive {
			@include font30();
			@include colF();
		}
	}
</style>
