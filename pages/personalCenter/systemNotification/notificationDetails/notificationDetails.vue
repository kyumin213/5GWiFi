<template>
	<view class="containerBox">
		<tab-top left-icon="back" :title="languageInfo.systemDetails"></tab-top>
		<view class="content">
			<view class="detailsTop">
				<text class="titles mb30">{{title}}</text>
				<text class="detailTime mb30">{{times}}</text>
				<text class="topBom mb30"></text>
			</view>
			<view class="uni-common-mt detalCon">
				<rich-text space :nodes="content" type="node"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue';
	var graceRichText = require("@/components/richText.js");
	var _this;
	export default {
		data() {
			return {
				title:'',
				content:[],
				times:'',
				languageInfo:{}
			}
		},
		components: {
			tabTop
		},
		onLoad(option){
			_this = this
			_this.title = option.title
			_this.content = graceRichText.format(option.content)
			_this.times = option.time
		},
		onShow(){
			_this.languageInfo = _this.linkTo.showLanguage();
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.mb30 {
		margin-bottom: 30rpx;
	}
.uni-common-mt{
	@include colF();
	line-height: 48rpx;
	// @include font30();
}
	.containerBox {
		@include bg();
		height: 100%;
		box-sizing: border-box;

		.content {
			padding: 30rpx;
			height: 100%;
			width: 100%;
			overflow-y: auto;
			word-break:break-all;
			word-wrap:break-word; 
			box-sizing: border-box;
			.detailsTop text {
				display: block;
			}

			.titles {
				@include font36();
				@include mainCol();
			}

			.detailTime {
				@include font24();
				@include colA();
			}

			.topBom {
				width: 100%;
				height: 2rpx;
				background: #3CF8FF;
			}
			.detalCon{
				display: inline-block;
				@include font24();
				@include colF();
				line-height: 48rpx;
				text-indent:2em;
				word-break:break-all;
				word-wrap:break-word; 
				width: 100%;
			}
		}
	}
</style>
