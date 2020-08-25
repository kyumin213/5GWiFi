<script>
	export default {
		onLaunch: function() {
			//console.log('App Launch')
			// uni.setStorageSync('languageType', 'zh-cn')
			uni.setStorageSync('lang', 'zh-cn')
			// uni.reLaunch({
			// 	url: '/pages/index/startPage/startPage',
			// 	animationType: 'pop-in',
			// 	animationDuration: 300
			// });
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	// @import '@/components/feng-parse/parse.css';
	/*每个页面公共css */
	button:after {
		border: none;
	}

	button {
		background: none;
	}

  .tipTxt {
		@include font24();
		@include colA();
		text-align: center;
		padding-top: 50%;
		box-sizing: border-box;
	}
	.uni-video-container{
		background: #0e1625;
	}
.loading-text{
	@include font24();
	@include colA();
	text-align: center;
	padding: 30rpx 0;
	box-sizing: border-box;
}
	view {
		line-height: 1;
	}

	page {
		background-color: #0c1524;
		box-sizing: border-box;
		padding-top: calc(var(--status-bar-height) + 110rpx);
		height: 100%;
		overflow-y: auto;
	}

	uni-web-view {
		position: static !important;
	}

	.txtItem {
		width: 100%;
		@include colF();
		@include font30();
	}

	.inp {
		@include borRadius();
		@include font26();
		@include borCol();
		@include mainCol();
		height: 80rpx;
		padding: 0 30rpx;
	}

	.inpFir {
		padding-left: 136rpx;
	}

	.placeStyle {
		color: #999;
		@include font24();
	}

	// 自定义提示
	.noYetTip {
		padding: 12rpx 20rpx;
		background: rgba(0, 0, 0, .5);
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		color: #fff;
		font-size: 26rpx;
		border-radius: 8rpx;
	}

	// 箭头
	.nextIcon {
		display: inline-block;
		width: 14rpx;
		height: 14rpx;
		border-top: 2rpx solid #fff;
		border-right: 2rpx solid #fff;
		transform: rotate(45deg);
	}

	// 按钮
	.btn {
		@include borCol();
		@include mainCol();
		@include font26();
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 98rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 30rpx;
	}

	// 提示文字
	.tips {
		@include font24();
		color: red;
	}
</style>
