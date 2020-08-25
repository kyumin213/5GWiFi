<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.baseStationList"></tab-top>
		<view class="content">
			<scroll-view scroll-y="true" class="scrollHeight" @scrolltolower="getmore">
				<view class="itemBox" v-for="(item,index) in lists" :key="index">
					<view>
						<view class="itemTops">
							<view>
								<view>
									<text class="txt1 mr10">{{languageInfo.BaseStationLevel}}:</text>
									<text class="txt2">{{item.base_station.base_name}}</text>
								</view>
								<view class="item1">
									<text class="txt1 mr10">{{languageInfo.startTime}}:</text>
									<text class="txt2">{{item.create_time}}</text>
								</view>
							</view>
							<view>
								<switch style="transform:scale(0.6)" :checked="item.auto=='1'" color="#3CF8FF" v-if="item.status=='1'" @change="switch1Change(index)" />
							</view>
						</view>

						<view class="progressBox">
							<text class="proTxt mr10">48{{languageInfo.countdownBase}}:</text>
							<view class="progress-box">
								<progress :percent="item.percent" activeColor="#3CF8FF" backgroundColor="transparent" active="true" active-mode="forwards"
								 stroke-width="8" />
							</view>
							<text class="proTxt" :class="{'completeTxt':item.percent==100}">{{languageInfo.completed}}{{item.lun_num}}{{languageInfo.wheel}}</text>
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
	import tabTop from '@/components/tabTop.vue';
	var _this;
	export default {
		data() {
			return {
				page: 1,
				rowNum: 15,
				lists: [],
				languageInfo: {},
				percent: 10,
				activeColor: '#3CF8FF',
				loadingText: 0,
				auto: 1
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
			_this.getBaseStation()
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
			// 按钮切换
			switch1Change(index) {
				let ids = _this.lists[index].id
				let auto = _this.lists[index].auto
				_this.auto = auto
				// setTimeout(() => {
				_this.post('api/autoBaseStation', {
					id: ids
				}).then(res => {
					_this.auto = res.data.res.auto
					if (res.data.res.auto == 1) {
						uni.showToast({
							title: _this.languageInfo.automaticallyOpen,
							icon: 'success'
						})
					} else if (res.data.res.auto == 2) {
						uni.showToast({
							title: _this.languageInfo.automaticShutdown,
							icon: 'success'
						})
					}
				})
				// },1000)
			},
			// 初始化
			getBaseStation() {
				let _this = this
				_this.loadingText = 0
				_this.page = 1
				let data = {
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/myBaseStationList', data).then(res => {
					if (res.data.res.data.length > 0) {
						_this.lists = res.data.res.data
						_this.total = res.data.res.total
						let datas = res.data.res.data
						for (let i in datas) {
							_this.lists[i].percent = ((datas[i].lun_num / datas[i].base_station.cycle) * 100).toFixed(2)
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
				_this.get('api/myBaseStationList', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.loadingText = 1
						uni.hideNavigationBarLoading(); //关闭加载动画
						return;
					} else {
						_this.page++
						let datas = res.data.res.data
						_this.lists = _this.lists.concat(datas); //将数据拼接在一起
						for (let i in _this.lists) {
							_this.lists[i].percent = ((_this.lists[i].lun_num / _this.lists[i].base_station.cycle) * 100).toFixed(2)
						}
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mr10 {
		margin-right: 10rpx;
	}

	.mt10 {
		margin-top: 15rpx;
	}

	progress {
		border-radius: 8rpx;
		@include borCol();
	}

	switch {
		height: 60rpx;
	}

	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;

		.content {
			padding: 10rpx 0;
			margin: 0rpx 24rpx;

			.scrollHeight {
				width: 100%;
				height: calc(100vh - 180rpx);
			}
		}

		.itemBox {
			width: 100%;
			// height: 200rpx;
			margin-bottom: 20rpx;
			border: 2rpx solid #0E1725;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			align-content: flex-start;
			padding: 20rpx 30rpx 30rpx 30rpx;
			box-shadow: inset 0 0 12rpx #3CF8FF;
			box-sizing: border-box;

			.itemTops {
				display: flex;
				justify-content: space-between;
			}

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

				.proTxt {
					@include mainCol();
					@include font24();
				}

				.progress-box {
					width: 350rpx;
					margin-right: 16rpx;
				}
			}
		}
	}
</style>
