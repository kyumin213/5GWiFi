<template>
	<view class="content">
		<tab-top left-icon="back" :title="languageInfo.inviteFriends"></tab-top>
		<view class="inviteBox">
			<view class="imgBox">
						<image src="../../../static/index/inviteBg.png" class="inviteBg"></image>
						<text class="invitedTxt">{{languageInfo.inviteFriends}}</text>
					</view>
			<!-- 		<view>
						<text class="invitedTxt">邀请好友</text>
					</view> -->
					<view class="borderBom"></view>
					<view class="codeBox">
						<image class="codeImg" :src="imgs"></image>
					</view>
					<view>
						<text class="uid">UID:{{UID}}</text>
					</view>
					<view>
						<text class="txtArea txtCh" v-if="lang == 'zh-cn'">{{languageInfo.timelessLegends}}</text>
						<text class="txtArea" v-else>{{languageInfo.timelessLegends}}</text>
					</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	var _this;
	export default {
		data() {
			return {
				token:'',
				imgs:'',
				UID:'',
				languageInfo: {},
				lang:''
			}
		},
		components: {
			tabTop
		},
		onLoad(){
			_this = this
		},
		onShow(){
			_this.languageInfo = _this.linkTo.showLanguage();
			_this.lang = uni.getStorageSync('lang')
			_this.UID = uni.getStorageSync('uid')
			_this.token = uni.getStorageSync('token')
			// _this.imgs = 'http://8.129.172.166:7091/api/inviteFriend?token='+encodeURIComponent(_this.token) //测试
			_this.imgs = 'http://8.210.16.34/api/inviteFriend?token='+encodeURIComponent(_this.token) //正式
			
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		@include bg();
		height: 100%;
		.inviteBox{
			width: 100%;
			position: absolute;
			top: 45%;
			transform: translateY(-45%);
			box-sizing: border-box;
			.imgBox{
				width: 100%;
				margin: 110rpx auto;
				text-align: center;
				position: relative;
			}
			.inviteBg{
				text-align: center;
				width: 566rpx;
				height: 366rpx;
			}
			.invitedTxt{
				font-size: 52rpx;
				@include mainCol();
				font-weight: bold;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 68rpx;
			}
			.borderBom{
				width: 500rpx;
				height: 2rpx;
				background-color: #3CF8FF;
				margin: 100rpx auto 60rpx auto;
				box-sizing: border-box;
			}
			.codeBox{
				width: 100%;
				text-align: center;
			}
			.codeImg{
				width: 182rpx;
				height: 182rpx;
				// background-color: #fff;
				margin: 0 auto 40rpx auto;
			}
			.uid{
				display: inline-block;
				@include font30();
				@include colF();
				width: 100%;
				text-align: center;
			}
			.txtArea{
				display: inline-block;
				width: 100%;
				text-align: center;
				@include mainCol();
				font-size: 35rpx;
				margin-top: 88rpx;
				
			}
			.txtCh{
				letter-spacing:20rpx;
			}
			
		}
	}
</style>
