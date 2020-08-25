<template>
	<view class="content">
		<view class="startBg"></view>
		<!-- <image class="startImg" src="~@/static/start.gif"></image> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			//APP端
			if (uni.getStorageSync('token')) { // 有token直接进入首页
				setTimeout(function() {
					uni.switchTab({
						url: '../index',
						animationType: 'pop-in',
						animationDuration: 300
					});
				}, 4000)
			} else {
				setTimeout(function() {
					uni.reLaunch({
						url: '../guidePages/guidePages',
						animationType: 'pop-in',
						animationDuration: 300
					});
				}, 4000)
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-head {
		display: none;
	}
	.content{
		position: absolute;
		top: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
		background: #090f18;
		.startBg {
			width: 100%;
			height: 100%;
			background: url('~@/static/startBg.gif') no-repeat center 100rpx
			;
			background-size: cover;
		}
	}
</style>
