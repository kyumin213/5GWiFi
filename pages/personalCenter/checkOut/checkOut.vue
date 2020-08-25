<template>
	<view class="containerBox">
		<tab-top left-Icon="back" :title="languageInfo.switchAccount"></tab-top>
		<view class="content">
			<scroll-view scroll-y="true" class="scrollHeight">
				<view class="itemBox" @tap="selectUser(index)" v-for="(item,index) in lists" :key='index'>
					<view>
						<text class="userName">{{item.uid}}</text>
						<text class="userId">{{item.eth_address}}</text>
					</view>
					<view v-show="select==index || uid==item.uid">
						<image class="selectIcon" src="~@/static/index/selectIcon.png"></image>
					</view>
				</view>
			</scroll-view>
			<!-- 			<view class="itemBox">
				<view>
					<text class="userName">User01</text>
					<text class="userId">thscde25Cxi82mldthscde25Cxi</text>
				</view>
				<view v-show="select">
					<image class="selectIcon" src="~@/static/index/selectIcon.png"></image>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	var _this = this
	export default {
		data() {
			return {
				select: -1,
				lists: [],
				uid:'',
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
			_this.uid = uni.getStorageSync('uid')
			_this.getUserList()
			_this.languageInfo = _this.linkTo.showLanguage()
		},
		methods: {
			// 选择账号
			selectUser(index) {
				_this.select = index
				let uid = _this.lists[index].uid
				_this.uid = _this.lists[index].uid
				let data ={
					phone:_this.lists[index].phone,
					uid:uid
				}
				_this.post('api/icrAccount',data).then(res=>{
					if(res.data.code==200){
						let token = res.data.res.token
						uni.setStorageSync('token', token)
						setTimeout(() => {
							uni.reLaunch({
								url: '../../index/index'
							})
						}, 1000)
					}
				})
			
			},
			// 账号列表
			getUserList() {
				_this.get('api/accountList').then(res => {
					_this.lists = res.data.res
					console.log(_this.lists);
				})
			}
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
		// @include bg();
		// height: 100%;
		box-sizing: border-box;
		padding: 0 20rpx 30rpx 20rpx;
		.scrollHeight {
			height: 100vh;
		}

		.itemBox {
			@include flexBet();
			@include borCol();
			padding: 0 40rpx;
			height: 120rpx;
			border-radius: 10rpx;
			margin-bottom: 10rpx;

			.userName {
				@include mainCol();
				@include font26();
				display: block;
			}

			.userId {
				@include font20();
				@include colF();
			}

			.selectIcon {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
</style>
