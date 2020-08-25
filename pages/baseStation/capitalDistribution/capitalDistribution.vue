<template>
	<view class="content">
		<tab-top left-icon="back" :title="_getLge('fundDistribution')"></tab-top>
		<view class="tabsBox fx">
			<view class="tabsItem" :class="[activeTabs==index?'activeTab':'']" v-for="(item,index) in tabs" :key="item.id"
			 @click="tabsChange(index)">
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="moveBorder">
			<image class="moveBorderImg" :style="{width:moveWidth + 'px',left:moveLeft + 'px'}" src="../../../static/baseStation/moveBorder.png"></image>
		</view>
		<swiper @change="swiperListChange" :current="activeTabs" class="listBox" :indicator-dots="false" circular="true"
		 :autoplay="false" :duration="300">
			<swiper-item class="listSwiperItem" v-for="(item,idx) in tabs" :key="item.id">
				<view class="swiper-item">
					<!-- :refresher-triggered="triggered['triggered'+idx]" @refresherrefresh="refreshLoad(idx)" @refresherrestore="onRestore(idx)" :refresher-threshold="55" refresher-enabled
					refresher-default-style="black" refresher-background="rgba(0,0,0,0)" -->
					<scroll-view v-if="item.list.length > 0" :lower-threshold="10" @scrolltolower="scrolltolowerMore(idx)" style="height: 100%;"
					 scroll-y="true" class="listScroll">
						<view v-for="(list,index) in item.list" :key="index" class="listItem">
							<text class="label">UID：</text>
							<text class="value">{{list.uid}}</text>
							<image class="borderBottom" src="../../../static/baseStation/borderBottom.png"></image>
						</view>
					</scroll-view>
					<view class="zero listScroll" v-if="item.list.length == 0">
						<text class="zero" v-if="item.firstReq == false">{{_getLge('noMore')}}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	export default {
		components: {
			tabTop,
		},
		data() {
			return {
				tabs: [{
						id: 1,
						name: 'V1',
						page: 1,
						lastPage: 2,
						list: [],
						lastShowToast: false,
						firstReq: true,
					},
					{
						id: 2,
						name: 'V2',
						page: 1,
						lastPage: 2,
						list: [],
						lastShowToast: false,
						firstReq: true,
					},
					{
						id: 3,
						name: 'V3',
						page: 1,
						lastPage: 2,
						list: [],
						lastShowToast: false,
						firstReq: true,
					},
					{
						id: 4,
						name: 'V4',
						page: 1,
						lastPage: 2,
						list: [],
						lastShowToast: false,
						firstReq: true,
					}
				],
				triggered: {
					triggered0: true,
					triggered1: true,
					triggered2: true,
					triggered3: true,
				},
				scrollHeight: 100,
				activeTabs: 0,
				moveWidth: 0,
				moveLeft: 0,
				rowNum: 20,
				firstEnter: true
			};
		},
		onLoad() {
			this._freshing = false;
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select('.tabsItem').boundingClientRect(data => {
				this.moveWidth = data.width
			}).exec();
			query.select('.listBox').boundingClientRect(data => {
				this.scrollHeight = data.width
			}).exec();
			this.getList()
		},
		methods: {
			tabsChange(index) {
				this.activeTabs = index
				this.moveLeft = index * this.moveWidth
			},
			getList() {
				if (this.tabs[this.activeTabs].lastPage <= this.tabs[this.activeTabs].page) {
					return
				}
				// 资金分布情况
				let params = {
					type: this.activeTabs + 1,
					page: this.tabs[this.activeTabs].page,
					rowNum: this.rowNum
				}
				this.get('api/capitalList', params).then(res => {
					if (res.data.code == 200) {
						let data = res.data.res
						if (data.data.length == 0 && !this.firstEnter) {
							uni.showToast({
								icon: 'none',
								title: this._getLge('thereIsNoMoreData'),
								duration: 1000
							})
						}
						this.tabs[this.activeTabs].page = this.tabs[this.activeTabs].page == data.last_page ? data.last_page : this.tabs[
							this.activeTabs].page + 1
						this.tabs[this.activeTabs].lastPage = data.last_page
						this.tabs[this.activeTabs].list = this.tabs[this.activeTabs].list.concat(data.data)
						this.tabs[this.activeTabs].firstReq = false
						// for(let i=0;i<10;i++){
						// 	this.tabs[this.activeTabs].list = this.tabs[this.activeTabs].list.concat(data.data)
						// }
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			swiperListChange(e) {
				this.activeTabs = e.detail.current
				this.tabsChange(e.detail.current)
				this.getList()
			},
			refreshLoad(index) {
				//console.log("onRestore", this._freshing);
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					uni.showToast({
						icon: 'success',
						duration: 2000,
					})
					this.triggered['triggered' + index] = false
				}, 2000)
			},
			scrolltolowerMore(index) {
				if (this.tabs[this.activeTabs].lastPage == this.tabs[this.activeTabs].page) {
					//限制提示
					if (!this.tabs[this.activeTabs].lastShowToast && !this.firstEnter) {
						uni.showToast({
							icon: 'none',
							title: this._getLge('thereIsNoMoreData'),
							duration: 1000
						})
						this.tabs[this.activeTabs].lastShowToast = true
					}
					return
				}
				this.getList()
			},
			onRestore(index) {
				this.triggered['triggered' + index] = 'restore'
				this._freshing = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	.fx {
		display: flex;
		flex-direction: row;
	}

	.content {
		@include bg();
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		.tabsBox {
			flex-shrink: 0;
			padding: 25rpx 0 22rpx 0;
			justify-content: space-around;
			align-items: center;
			background: linear-gradient(to bottom, #0B172A, #213554);

			.activeTab {
				text {
					color: #3CF8FF !important;
				}
			}

			.tabsItem {
				text-align: center;
				flex: 1;

				text {
					display: block;
					font-size: 24rpx;
					color: #FFFFFF;
					transition: .3s;
				}
			}
		}

		.moveBorder {
			line-height: 0;
			height: 2rpx;
			margin-bottom: 20rpx;

			.moveBorderImg {
				position: relative;
				display: block;
				height: 2rpx;
				transition: .3s;
			}
		}

		.listBox {
			min-height: 200rpx;
			flex: 1;

			.listSwiperItem {
				padding: 0 20rpx 10rpx 20rpx;
				box-sizing: border-box;
				height: 100%;

				.swiper-item {
					height: 100%;

					.zero {
						height: 100%;
						display: block;
						text-align: center;
						width: 100%;
						box-sizing: border-box;
						padding: 40rpx 20rpx 40rpx 20rpx;
						font-size: 30rpx;
						color: #FFFFFF;
					}

					.listScroll {
						border-radius: 10rpx;
						border: 1rpx solid #3CF8FF;
						box-sizing: border-box;

						.listItem:first-child {
							padding-top: 39rpx;
							margin-top: 0rpx;
						}

						.listItem {
							padding: 0 40rpx 0 40rpx;
							margin-top: 39rpx;
							font-size: 30rpx;

							.label {
								color: #3CF8FF;
							}

							.value {
								color: #FFFFFF;
							}

							.borderBottom {
								margin-top: 30rpx;
								display: block;
								height: 1rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
