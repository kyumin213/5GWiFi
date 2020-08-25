<template>
	<view class="content">
		<!-- top -->
		<view class="topNav">
			<tab-top left-icon="back" :title="name"></tab-top>
		</view>
		<image class="topImg" src="../../../../static/interestDetail/topImg.png"></image>
		<view class="interestTitle">
			<text>{{_getLge('contractTime')}}: {{start}}</text>
			<text>{{_getLge('releaseTime')}}: {{end}}</text>
		</view>
		<view class="listTitle">
			<text>{{_getLge('revenueRecords')}}</text>
		</view>
		<scroll-view :lower-threshold="10" @scrolltolower="scrolltolowerMore" scroll-y="true" class="listScroll">
			<view  v-if="listData.length != 0" v-for="(list,index) in listData" :key="index" class="listItem">
				<text class="label">{{list.create_time}}</text>
				<text class="value">+{{list.num}}<text class="wifi"> WIFI</text></text>
			</view>
			<view class="content" v-if="listData.length == 0">
				<text class="zero" v-if="firstReq == false">{{_getLge('noMore')}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	export default {
		data() {
			return {
				id:'',
				start:'',
				end:'',
				name:'',
				listData: [],
				lastPage: 2,
				currentPage: 1,
				perPage: 20,
				currentId: '',
				currentIndex: 0,
				firstReq:true
			}
		},
		methods: {
			scrolltolowerMore() {
				if (this.currentPage >= this.lastPage) {
					uni.showToast({
						icon: 'none',
						title: this._getLge('thereIsNoMoreData'),
						duration: 1000
					})
					return
				}
				this.getList()
			},
			
			getList() {
				let data = {
					fund_id: this.id,
					rowNum: this.perPage,
					page: this.currentPage,
				}
				this.get('api/fundEarnings', data).then(res => {
					if (res.data.code == 200) {
						let data = res.data.res
						if (data.data.length == 0 && !this.firstReq) {
							uni.showToast({
								icon: 'none',
								title: this._getLge('thereIsNoMoreData'),
								duration: 1000
							})
						}
						this.firstReq = false
						this.lastPage = data.last_page
						this.currentPage = this.currentPage + 1
						this.listData = this.listData.concat(data.data)
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
		},
		onLoad:function (option) { //option为object类型，会序列化上个页面传递的参数
			this.id = option.id
			this.start = option.start
			this.end = option.end
			this.name = option.name
			this.getList()
		},
		components: {
			tabTop
		},
	}
</script>

<style scoped lang="scss">
	.content {
		@include bg();
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		
		.zero{
			text-align: center;
			display: block;
			width: 100%;
			box-sizing: border-box;
			padding: 40rpx 20rpx 40rpx 20rpx;
			font-size: 20rpx;
			color: #FFFFFF;
		}
		.topImg {
			width: 474rpx;
			height: 350rpx;
			margin: 0 auto;
			margin-bottom: 20rpx;
			flex-shrink: 0;
		}

		.interestTitle {
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 40rpx;

			text {
				font-size: 24rpx;
				color: #FFFFFF;
				margin-bottom: 14rpx;
			}
		}

		.listTitle {
			flex-shrink: 0;
			width: auto;
			height: 82rpx;
			margin: 0 30rpx 0rpx 30rpx;
			line-height: 76rpx;
			text-align: center;
			border: 1px solid #3CF8FF;
			border-top-left-radius: 6rpx;
			border-top-right-radius: 6rpx;
			border-bottom: none;
			text {
				font-size: 24rpx;
				color: #3CF8FF;
			}
		}

		.listScroll {
			width: auto;
			flex: 1;
			min-height: 200rpx;
			margin: 0 30rpx 10rpx 30rpx;
			box-sizing: border-box;
			border: 1px solid #3CF8FF;
			border-bottom-left-radius: 6rpx;
			border-bottom-right-radius: 6rpx;
			.listItem {
				box-sizing: border-box;
				padding: 28rpx 30rpx;
				font-size: 20rpx;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #3CF8FF;

				.label {
					color: #3CF8FF;
				}

				.value {
					color: #FFFFFF;

					.wifi {
						padding-left: 10rpx;
						color: #2DEAB7;
					}
				}
			}
		}
	}
</style>
