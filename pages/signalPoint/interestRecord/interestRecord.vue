<template>
	<view class="containerBox">
		<tab-top left-icon='back' :title="_getLge('interestBearingRecords')"></tab-top>
		<scroll-view :lower-threshold="10" @scrolltolower="scrolltolowerMore" style="height: 100%;width: 100%;" scroll-y="true"
		 class="listScroll">
			<view class="content" v-if="listData.length > 0">
				<view class="itemList" @tap="goTo(item,index)" v-for="(item,index) in listData">
					<view style="width: 100%;">
						<view class="titleBox">
							<text class="itemTitle">{{_getLge('fund')}} {{index + 1 < 10?'0'+(index + 1):index + 1}}</text>
							<text class="itemTitle">{{item.num}}</text>
						</view>
						<view>
							<text class="txt1">{{_getLge('contractTime')}}:</text>
							<text class="txt2">{{item.create_time}}</text>
						</view>

						<view>
							<text class="txt1">{{_getLge('releaseTime')}}:</text>
							<text class="txt2">{{item.expire_time}}</text>
						</view>
					</view>
					<view v-if="item.status != 3 && item.status != 2" class="unDoBtn" @tap.stop="unDo(item.id,index)">
						<image class="btnIcon" src="~@/static/market/icon2.png"></image>
						<text>{{_getLge('revoke')}}</text>
					</view>
					<view v-if="item.status == 3" class="unDoBtn" style="background: none;padding: 0;right: 38rpx;">
						<text style="color: #a3a3a3;font-size: 28rpx;">{{_getLge('rescinded')}}</text>
					</view>
					<view v-if="item.status == 2" class="unDoBtn" style="background: none;padding: 0;right: 38rpx;">
						<text style="color: #1fe12f;font-size: 28rpx;">{{_getLge('complete')}}</text>
					</view>
				</view>
			</view>
			<view class="tipTxt" v-if="listData.length == 0">
				<text class="zero" v-if="firstReq == false">{{_getLge('noMore')}}</text>
			</view>
		</scroll-view>
		<!-- 撤销弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="modalBox">
				<view class="modalCon">
					<view class="title">
						<text>{{_getLge('confirmRevocation')}}</text>
					</view>
					<view class="allTotal">
						<text>{{_getLge('penaltyForCancellation')}}</text>
					</view>
					<view class="allTotal2">
						<text>{{_getLge('total')}}</text>
						<text class="bigText">10%</text>
					</view>
					<!-- <view class="unDoNumBox">
							<text class="txt2">{{unDoNum}}</text>
							<text class="txt3">WiFi</text>
						</view> -->
					<view>
						<button class="subBtn" @tap="cancelOrder">{{_getLge('confirm')}}</button>
					</view>
					<view class="mb44">
						<button class="subBtn" @tap="closeModal">{{_getLge('cancel')}}</button>
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		data() {
			return {
				listData: [],
				lastPage: 2,
				currentPage: 1,
				perPage: 20,
				currentId: '',
				currentIndex: 0,
				firstReq: true
			}
		},
		components: {
			tabTop,
			uniPopup
		},
		onShow() {},
		onLoad() {
			this.getList()
		},
		methods: {
			timeCpd(data) {
				let date = new Date(Number(data) * 1000);
				var YY = date.getFullYear() + '-';
				var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				return YY + MM + DD + " " + hh + mm + ss;
			},
			// 撤销
			unDo(id, index, e) {
				let _this = this
				this.currentId = id
				this.currentIndex = index
				_this.$refs.popup.open();
			},
			// 取消
			closeModal() {
				let _this = this
				_this.$refs.popup.close();
			},
			timeCpd(data) {
				let date = new Date(Number(data) * 1000);
				var YY = date.getFullYear() + '-';
				var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				return YY + MM + DD + " " + hh + mm + ss;
			},
			getList() {
				let data = {
					rowNum: this.perPage,
					page: this.currentPage,
				}
				this.get('api/buyFundList', data).then(res => {
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
						for (let i = 0; i < data.data.length; i++) {
							data.data[i].expire_time = this.timeCpd(data.data[i].expire_time)
						}
						this.listData = this.listData.concat(data.data)
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			// 加载更多
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
			cancelOrder() {
				this.post('api/cancelFund', {
					fund_id: this.currentId
				}).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: this._getLge('revocationSuccessful'),
							type: 'success',
							duration: 1000
						});
						this.listData.splice(this.currentIndex, 1)
						this.$refs.popup.close();
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			goTo(item, index) {
				let num = index + 1 < 10 ? '0' + (index + 1) : index + 1
				let params = {
					name: this._getLge('fund') + num + this._getLge('interestBearingRecords'),
					start: item.create_time,
					end: item.expire_time,
					id: item.id
				}
				uni.navigateTo({
					url: 'interestDetail/interestDetail?name=' + params.name + '&start=' + params.start + '&end=' + params.end +
						'&id=' + params.id,
					animationType: 'pop-in',
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mb44 {
		margin-bottom: 44rpx;
	}

	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;
		padding-top: 20rpx;
	}

	.content {
		margin: 0 20rpx;

		.zero {
			text-align: center;
			display: block;
			width: 100%;
			box-sizing: border-box;
			padding: 40rpx 20rpx 40rpx 20rpx;
			font-size: 30rpx;
			color: #FFFFFF;
		}

		.itemList {
			position: relative;
			height: 200rpx;
			@include borCol();
			@include flexBet();
			align-items: flex-end;
			border-radius: 10rpx;
			padding: 46rpx 40rpx;
			box-sizing: border-box;
			margin-bottom: 10rpx;

			.titleBox {
				width: 100%;
				display: flex;
				margin-bottom: 10rpx;
				justify-content: space-between;

				.itemTitle {
					color: #3CF8FF;
					font-size: 30rpx;
				}
			}

			.txt1 {
				@include mainCol();
				font-size: 20rpx;
				color: #FFFFFF;
				margin-right: 12rpx;
			}

			.txt2 {
				@include colF();
				@include font24();
			}

			.sellStatus {
				@include colF();
				@include font22();
				display: inline-block;
				padding: 6rpx 14rpx;
				background: #1ABA29;
				border-radius: 4rpx;
			}

			.buy {
				background: #FF3C3C;
			}

			.unDoBtn {
				@include font20();
				@include cen();
				height: 44rpx;
				line-height: 44rpx;
				padding: 0 22rpx;
				background: linear-gradient(to top, #3CF8FF, #009BF0);
				border-radius: 22rpx;
				position: absolute;
				right: 30rpx;
				bottom: 36rpx;
			}

			.btnIcon {
				width: 26rpx;
				height: 24rpx;
				margin-right: 6rpx;
			}
		}
	}

	// 弹窗
	.modalBox {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .7);
		z-index: 9;

		.modalCon {
			@include borCol();
			border-radius: 10rpx;
			background: #021628;
			position: absolute;
			top: 50%;
			left: 154rpx;
			right: 154rpx;
			transform: translateY(-50%);
			z-index: 10;

			.title {
				@include font30();
				@include colF();
				height: 90rpx;
				line-height: 90rpx;
				background-color: #042848;
				text-align: center;
				border-top: 2rpx solid #3CF8FF;
				border-bottom: 2rpx solid #3CF8FF;
			}

			.allTotal {
				@include font28();
				@include colF();
				text-align: center;
				margin: 40rpx auto 40rpx auto;
			}

			.allTotal2 {
				font-size: 24rpx;
				color: #3CF8FF;
				text-align: center;
				margin: 40rpx auto 40rpx auto;

				.bigText {
					font-size: 50rpx;
				}
			}

			.unDoNumBox {
				text-align: center;
				padding-bottom: 30rpx;
			}

			.txt2 {
				@include mainCol();
				@include font44();
				font-weight: bold;
			}

			.txt3 {
				@include mainCol();
				@include font30();
				margin-left: 10rpx;
			}

			.subBtn {
				height: 60rpx;
				line-height: 54rpx;
				@include borCol();
				@include font24();
				@include colF();
				margin: 20rpx 40rpx;
				border-radius: 4rpx;
			}

		}
	}
</style>
