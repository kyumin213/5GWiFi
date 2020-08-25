<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.HumanServices"></tab-top>
		<view class="centent">
			<view class="tipBox">
				<view>
					<image src="~@/static/me/icon10.png" class="icons"></image>
				</view>
				<text class="txt">{{languageInfo.tellMeProblem}}</text>
			</view>
			<view>
				<textarea  type="textarea" v-model="content" class="areaInp" />
			</view>
			<view>
				<button class="btn" hover-class="none"  @tap="setService">{{languageInfo.submit}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	export default {
		data() {
			return {
				content:'',
				languageInfo:{}
			}
		},
		components: {
			tabTop
		},
		onShow(){
			this.languageInfo = this.linkTo.showLanguage()
		},
		methods: {
			setService(){
				let _this = this
				let content = _this.content
				_this.post('api/staffService',{content:content}).then(res=>{
					uni.showToast({
						icon:'success'
					})
					setTimeout(()=>{
						uni.reLaunch({
							url:'../../personalCenter'
						})
					},1000)
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

		.centent {
			padding: 0 40rpx;

			.tipBox {
				display: flex;
				align-items: center;
			}

			.icons {
				width: 30rpx;
				height: 30rpx;
			}

			.txt {
				@include font24();
				@include mainCol();
				margin-left: 12rpx;
				line-height: 34rpx;
			}
			.areaInp{
				@include borCol();
				@include mainCol();
				@include font26();
				border-radius: 8rpx;
				width: 100%;
				height: 300rpx;
				margin-top: 32rpx;
				padding: 20rpx;
				box-sizing: border-box;
			}
		}

	}
</style>
