<template>
	<view class="content">
		<tab-top left-icon="back" :title="languageInfo.MyCommunity"></tab-top>
		<!-- 等级 -->
		<view class="levelBox">
			<view>
				<image v-if="level=='0'" src="~@/static/me/level0.png" class="levelIcon"></image>
				<image v-if="level=='1'" src="~@/static/me/level1.png" class="levelIcon"></image>
				<image v-if="level=='2'" src="~@/static/me/level2.png" class="levelIcon"></image>
				<image v-if="level=='3'" src="~@/static/me/level3.png" class="levelIcon"></image>
				<image v-if="level=='4'" src="~@/static/me/level4.png" class="levelIcon"></image>
			</view>
			<view>
				<text class="idTxt">ID:{{userUid}}</text>
				<text class="telTxt">{{languageInfo.registerMobile}}：{{phone}}</text>
			</view>
		</view>
		<!-- 业绩、人数 -->
		<view class="box1">
			<view>
				<text class="txt1">{{languageInfo.totalPerformance}}</text>
				<text class="txt1 mt30">{{languageInfo.numberCommunity}}</text>
			</view>
			<view>
				<text class="txt2">{{allPerformance}}</text>
				<text class="txt2 mt30">{{allPeopleNum}}</text>
			</view>
		</view>
		<!-- tab切换 -->
		<view class="navBar mt30">
			<view class="navItem" :class="{'selectOn':currentIndex==1}" @tap="changeTab(1)">
				<text>{{languageInfo.Acommunity}}</text>
				<image v-show="currentIndex==1" class="navBom" src="~@/static/index/bor-bom.png"></image>
			</view>
			<view class="navItem" :class="{'selectOn':currentIndex==2}" @tap="changeTab(2)">
				<text>{{languageInfo.SecondCommunity}}</text>
				<image v-show="currentIndex==2" class="navBom" src="~@/static/index/bor-bom.png"></image>
			</view>
			<view class="navItem" :class="{'selectOn':currentIndex==3}" @tap="changeTab(3)">
				<text>{{languageInfo.threeCommunity}}</text>
				<image v-show="currentIndex==3" class="navBom" src="~@/static/index/bor-bom.png"></image>
			</view>
			<!-- 	<view class="navItem" @tap="changeTab(4)">
					<text>超级社区</text>
					<image v-show="currentIndex==4" class="navBom" src="~@/static/index/bor-bom.png"></image>
				</view> -->
		</view>
		<!-- 列表 -->
		<scroll-view class="scroHeight" :scroll-y="true" @scrolltolower="getmore">
			<view class="items" v-for="(item,index) in communityData" :key="index">
				<view>
					<view>
						<text class="txt1">UID：</text>
						<text class="txt2">{{item.user.uid}}</text>
					</view>
					<view class="mt14" v-if="item.base_name">
						<text class="txt1">{{languageInfo.BaseStationLevel}}：</text>
						<text class="txt2">{{item.base_name}}</text>
					</view>
					<view class="mt14">
						<text class="txt1">{{languageInfo.regTime}}：</text>
						<text class="txt2">{{item.user.create_time}}</text>
					</view>
					<view class="mt14">
						<text class="txt1">{{languageInfo.regNumber}}：</text>
						<text class="txt2">{{item.user.phone}}</text>
					</view>
				</view>
				<image src="~@/static/me/icon11.png" class="validIcon" v-if="item.user.state=='1'"></image>
				<image src="~@/static/me/icon12.png" class="validIcon" v-else></image>
			</view>
			<view class="tipTxt" v-if="communityData.length==0">{{languageInfo.noData}}</view>
			<view class="loading-text" v-if="loadingType==1&&communityData.length>0">{{languageInfo.scrollTaps}}</view>
		</scroll-view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	var _this;
	export default {
		data() {
			return {
				isNull: false,
				currentIndex: 1, //当前选中tab
				typeItem: 1, //社区类型
				page: 1, //当前页
				rowNum: 10, //每页条数
				communityData: [],
				total: 0, // 总数
				loadingText: 0,
				loadingType: 0,
				allPerformance: '', //总业绩
				allPeopleNum: '', //总人数
				phone: '', //注册手机
				userUid: '', //用户ID
				level: '', //等级
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
			this.getMyCommunity()
			this.getInfo()
		},
		onPullDownRefresh() {
			_this.page = 1;
			_this.communityData = [];
			_this.total = [];
			_this.getMyCommunity()
		},
		onReachBottom() {
			let arr = _this.communityData.length
			let total = _this.total
			if (arr < total) {
				_this.getmore()
			}
		},
		methods: {
			// tab切换
			changeTab(index) {
				_this.currentIndex = index
				_this.page = 1
				// _this.loadingType = 0
				_this.getMyCommunity()
			},
			// 社区等级信息
			getInfo() {
				_this.get('api/communityInfo').then(res => {
					if (res.data.code == 200) {
						_this.allPerformance = res.data.res.performance
						_this.allPeopleNum = res.data.res.people_num
						_this.phone = res.data.res.phone
						_this.userUid = res.data.res.uid
						_this.level = res.data.res.level
					}
				})
			},
			// 我的社区列表
			getMyCommunity() {
				_this.loadingType = 0;
				uni.showNavigationBarLoading()
				let data = {
					type: _this.currentIndex,
					page: _this.page,
					rowNum: _this.rowNum
				}
				_this.get('api/myCommunity', data).then(res => {
					if (res.data.code == 200) {
						if (res.data.res.data.length == 0) {
							_this.communityData = []
						} else {
							_this.communityData = res.data.res.data
						}
						_this.total = res.data.res.total
					}
					uni.hideNavigationBarLoading(); //关闭加载动画
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
				})
			},
			// 上拉加载// 上拉加载
			getmore() {
				// let _this = this
				let page = _this.page
				page++
				uni.showNavigationBarLoading(); //显示加载动画
				let data = {
					type: _this.currentIndex,
					page: page,
					rowNum: _this.rowNum
				}
				_this.get('api/myCommunity', data).then(res => {
					if (res.data.res.data.length == 0) {
						_this.loadingType = 1
						uni.hideNavigationBarLoading(); //关闭加载动画
						return;
					} else {
						this.page++
						_this.communityData = _this.communityData.concat(res.data.res.data); //将数据拼接在一起
						uni.hideNavigationBarLoading(); //关闭加载动画
					}

				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.mt30 {
		margin-top: 30rpx;
	}

	.mt14 {
		margin-top: 14rpx;
	}

	.content {
		@include bg();
		height: 100%;
		box-sizing: border-box;

		.scroHeight {
			width: 100%;
			height: calc(100vh - 500rpx);
			padding-bottom: 100rpx;
			box-sizing: border-box;

			.loading-text {
				width: 100%;
				text-align: center;
				@include font24();
				color: #ccc;
				padding-top: 20rpx;
			}
		}

		.levelBox {
			margin: 0 20rpx;
			display: flex;
			align-items: center;
			background-image: url('~@/static/me/bg1.png');
			background-size: 100% 100%;
			height: 150rpx;
			padding: 36rpx 46rpx;
			box-sizing: border-box;

			.levelIcon {
				width: 72rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}

			.idTxt {
				font-size: 35rpx;
				@include mainCol();
				font-weight: bold;
				display: block;
			}

			.telTxt {
				@include colF();
				@include font24();
			}
		}

		// 业绩
		.box1 {
			@include flexBet();
			height: 140rpx;
			padding: 30rpx 40rpx;
			border: 2rpx solid #72ADFF;
			box-sizing: border-box;
			border-radius: 6rpx;
			margin: 30rpx 20rpx 0 20rpx;

			.txt1 {
				display: block;
				@include mainCol();
				@include font24();
			}

			.txt2 {
				display: block;
				@include colF();
				@include font30();
				text-align: right;
				font-weight: bold;
			}
		}

		// tab
		.navBar {
			@include cen();
			height: 68rpx;
			background: linear-gradient(to top, #0B172A, #213554);

			.navItem {
				width: 33.3%;
				@include font24();
				@include colF();
				text-align: center;
				height: 68rpx;
				line-height: 68rpx;
				position: relative;

				.navBom {
					position: absolute;
					bottom: 2rpx;
					left: 0;
					width: 100%;
					height: 2rpx;
				}
			}

			.selectOn {
				@include mainCol();
			}
		}

		// 列表
		.items {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: 40rpx;
			margin: 20rpx;
			@include borCol();
			border-radius: 10rpx;

			.validIcon {
				width: 70rpx;
				height: 56rpx;
			}

			.txt1 {
				@include mainCol();
				@include font24();
			}

			.txt2 {
				@include font24();
				@include colF();
			}
		}

	}
</style>
