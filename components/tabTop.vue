<template>
	<view>
		<!-- <uni-nav-bar @clickRight="clickRight" :class="{box:open}"  class="box" :color="color" :left-icon="leftIcon" status-bar :right-text="rightText" :title="title">
			<text slot="right">
				<slot name="rightBox" />
			</text>
		</uni-nav-bar> -->
		<view class="headTop" @clickRight="clickRight">
			<view class="leftBox">
				<uni-icons :type="leftIcon" size="24"  @tap="back"/>
				<text class="logoTxt ml20">{{title}}</text>
			</view>
			<view class="rightBox">
				<slot name="rightBox" />
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		components: {uniNavBar},
		props:{
			leftIcon:{
				default:'back'
			},
			rightText:{
				default:''
			},
			title:{
				default:'导航栏组件'
			},
			color:{
				default:'#fff'
			},
			open:{
				//是否隐藏头部背景图
				default:true,
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			back(){
				uni.navigateBack();
			},
			clickLeft(){
				this.$emit('');
				//console.log('111')
			},
			clickRight(){
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped lang="scss">
	.box{
		width: 100%;
		/* background-color: rgba(0,0,0,.6); */
	}
	.headTop {
		position: fixed;
		top: 0;
		width: 100%;
		height: calc(var(--status-bar-height) + 100rpx);
		padding-top: calc(var(--status-bar-height) + 50rpx);
		padding-left: 30rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 10;
		background: #0d1424;
		// height: 100rpx;
		// padding-top: 50rpx;
		// box-sizing: border-box;
		// margin: 0 auto 40rpx 30rpx;
		// display: flex;
		// align-items: center;
		.leftBox{
			display: flex;
			align-items: center;
		}
		.logoIcon {
			width: 32rpx;
			height: 36rpx;
			margin-right: 8rpx;
		}
		
		.logoTxt {
			@include colF();
			font-weight: bold;
			font-size: 35rpx;
		}
		.rightBox{
			margin-right: 0;
			padding-right: 28rpx;
		}
	}

</style>
