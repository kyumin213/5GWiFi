<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.SecuritySettings"></tab-top>
		<view class="itemBox">
			<view class="items" @tap="goTo('updatePwd')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon8.png"></image>
					<text class="txt">{{languageInfo.updatePwd}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
			<view class="items" @tap="goTo('updatePayPwd')">
				<view class="itemLeft">
					<image class="icon" src="~@/static/me/icon9.png"></image>
					<text class="txt">{{languageInfo.changePayPwd}}</text>
				</view>
				<text class="nextIcon"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	export default {
		data() {
			return {
				languageInfo:{}
			}
		},
		components:{
			tabTop
		},
		onShow() {
			this.languageInfo = this.linkTo.showLanguage();
		},
		methods: {
			// 跳转
			goTo(url){
				this.linkTo.navTo(url)
			}
		}
	}
</script>
<style scoped lang="scss">
	.containerBox{
		@include bg();
		height: 100%;
		box-sizing: border-box;
	}
.itemBox{
	// @include fixBg();
	padding: 0 20rpx;
	box-sizing: border-box;
	.items{
		@include flexBet();
		height: 100rpx;
		border: 2rpx solid #72ADFF;
		margin-bottom: 10rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-radius: 6rpx;
		.itemLeft{
			display: flex;
			align-items: center;
			height: 80rpx;
			
		}
		.icon{
			width: 44rpx;
			height: 44rpx;
		}
		.txt{
			@include font24();
			@include colF();
			margin-left: 20rpx;
		}
	}
}
</style>
